import { ScrollView, Text, View, Alert, Pressable, StyleSheet } from "react-native";
import { useState, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser, getToken } from "../store/redux/selectors";
import { logout, updateLocalUser } from "../store/redux/actions/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import Input from "../components/UI/Input";
import SettingsBtn from "../components/Settings/SettingsBtn";
import Button from "../components/UI/Button";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { validateEmail } from "../utils/validation";
import { updateUser, deleteUser } from "../utils/api";

function AccountSettings({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const currentUser = useSelector(getCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isDataUpdating, setIsDataUpdating] = useState(false);
  const initialInputs = {
    firstname: {
      value: currentUser.firstname,
      isValid: true,
    },
    lastname: {
      value: currentUser.name,
      isValid: true,
    },
    phoneNumber: {
      value: currentUser.phone,
      isValid: true,
    },
    email: {
      value: currentUser.email,
      isValid: true,
    },
    minibio: {
      value: currentUser.description,
      isValid: true,
    },
  };
  const [inputs, setInputs] = useState(initialInputs);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return !isEditing ? (
          <Pressable style={styles.settingsBtn} onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil" size={22} color="white" />
          </Pressable>
        ) : (
          <Pressable style={styles.settingsBtn} onPress={() => submitHandler()}>
            <Text style={styles.saveText}>Sauver</Text>
          </Pressable>
        );
      },
    });
  }, [navigation, isEditing, submitHandler]);

  function inputChangeHandler(input, inputValue) {
    setInputs((currentValues) => {
      return {
        ...currentValues,
        [input]: { value: inputValue, isValid: true },
      };
    });
  }

  async function submitHandler() {
    if (currentUser.length === 0) {
      Alert.alert("Erreur", "Impossible d'enregistrer les modifications pour le moment…");
      setIsEditing(false);
      return;
    }
    const firstnameIsValid = inputs.firstname.value?.trim().length >= 3;
    const lastnameIsValid = inputs.lastname.value?.trim().length >= 3;
    const phoneIsValid = inputs.phoneNumber.value?.length >= 10;
    const emailIsValid = validateEmail(inputs.email.value);

    if (!firstnameIsValid || !lastnameIsValid || !phoneIsValid || !emailIsValid) {
      setInputs((currInputs) => {
        return {
          firstname: {
            value: currInputs.firstname.value,
            isValid: firstnameIsValid,
          },
          lastname: {
            value: currInputs.lastname.value,
            isValid: lastnameIsValid,
          },
          phoneNumber: {
            value: currInputs.phoneNumber.value,
            isValid: phoneIsValid,
          },
          email: { value: currInputs.email.value, isValid: emailIsValid },
          email: { value: currInputs.minibio.value, isValid: true },
        };
      });
      return;
    }

    if (
      inputs.firstname.value === initialInputs.firstname.value &&
      inputs.lastname.value === initialInputs.lastname.value &&
      inputs.phoneNumber.value === initialInputs.phoneNumber.value &&
      inputs.email.value === initialInputs.email.value &&
      inputs.minibio.value === initialInputs.minibio.value
    ) {
      Alert.alert("Attention", "Aucune donnée à modifier…");
      setIsEditing(false);
      return;
    }

    try {
      setIsDataUpdating(true);
      await updateUser(
        currentUser.pseudo,
        inputs.firstname.value,
        inputs.lastname.value,
        inputs.phoneNumber.value,
        inputs.email.value,
        inputs.minibio.value,
        token
      );
      const updatedUser = {
        ...currentUser,
        firstname: inputs.firstname.value,
        name: inputs.lastname.value,
        phone: inputs.phoneNumber.value,
        email: inputs.email.value,
        description: inputs.minibio.value,
      };
      dispatch(updateLocalUser(updatedUser));
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'effectuer les modifications…");
      setInputs(initialInputs);
    }
    setIsEditing(false);
    setIsDataUpdating(false);
  }

  function deleteAccountHandler() {
    Alert.alert("Attention", "Êtes-vous sûr de vouloir supprimer définitivement votre compte ?", [
      {
        text: "Oui",
        onPress: async () => {
          try {
            setIsDataUpdating(true);
            await deleteUser(currentUser.pseudo, token);
            dispatch(logout());
          } catch (e) {
            setIsDataUpdating(false);
            Alert.alert(
              "Erreur",
              "Impossible de supprimer le compte… Veuillez réessayer plus tard."
            );
          }
        },
        style: "destructive",
      },
      {
        text: "Non",
        style: "default",
      },
    ]);
  }

  if (isDataUpdating) {
    return <LoadingSpinner message="Modifications en cours..." />;
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.form}>
          <Input
            label="Prénom"
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, "firstname"),
              value: inputs.firstname.value,
              maxLength: 30,
              editable: isEditing,
            }}
            errorMsg={inputs.firstname.isValid ? null : "Minimum 3 caractères."}
          />
          <Input
            label="Nom"
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, "lastname"),
              value: inputs.lastname.value,
              maxLength: 30,
              editable: isEditing,
            }}
            errorMsg={inputs.lastname.isValid ? null : "Minimum 3 caractères."}
          />
          <Input
            label="Numéro de téléphone"
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, "phoneNumber"),
              value: inputs.phoneNumber.value,
              keyboardType: "phone-pad",
              maxLength: 12,
              editable: isEditing,
            }}
            errorMsg={inputs.phoneNumber.isValid ? null : "Numéro invalide."}
          />
          <Input
            label="Email"
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, "email"),
              value: inputs.email.value,
              keyboardType: "email-address",
              maxLength: 40,
              editable: isEditing,
            }}
            errorMsg={inputs.email.isValid ? null : "Email invalide."}
          />
          <Input
            label="Minibio"
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, "minibio"),
              value: inputs.minibio.value,
              multiline: true,
              editable: isEditing,
              maxLength: 200,
            }}
            errorMsg={inputs.email.isValid ? null : "Email invalide."}
          />
        </View>
        <SettingsBtn rightArrow onPress={() => navigation.navigate("AddressChange")}>
          Modifier mon adresse
        </SettingsBtn>
        <SettingsBtn rightArrow onPress={() => navigation.navigate("PasswordChange")}>
          Modifier mon mot de passe
        </SettingsBtn>
        <Button style={styles.deleteBtn} type="danger" onPress={deleteAccountHandler}>
          Supprimer mon compte
        </Button>
      </ScrollView>
    </View>
  );
}

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    overflow: "visible",
  },
  form: {
    padding: 10,
  },
  saveText: {
    color: "white",
  },
  deleteBtn: {
    marginTop: 50,
    marginBottom: 20,
  },
});
