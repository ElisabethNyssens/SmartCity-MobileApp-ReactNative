import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useState, useContext } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import TextSeparator from "../components/UI/TextSeparator";
import TextButton from "../components/UI/TextButton";
import themeContext from "../store/context/ThemeContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { createUser } from "../utils/api";
import { useDispatch } from "react-redux";
import { authenticate } from "../store/redux/actions/auth";
import { validateEmail, validatePassword } from "../utils/validation";

function SignInScreen({ navigation }) {
  const dispatch = useDispatch();
  const theme = useContext(themeContext);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [inputs, setInputs] = useState({
    pseudo: {
      value: "",
      isValid: true,
    },
    firstname: {
      value: "",
      isValid: true,
    },
    lastname: {
      value: "",
      isValid: true,
    },
    phoneNumber: {
      value: "",
      isValid: true,
    },
    email: {
      value: "",
      isValid: true,
    },
    password: {
      value: "",
      isValid: true,
    },
    streetName: {
      value: "",
      isValid: true,
    },
    streetNumber: {
      value: "",
      isValid: true,
    },
    zipCode: {
      value: "",
      isValid: true,
    },
    location: {
      value: "",
      isValid: true,
    },
  });

  function inputChangeHandler(input, inputValue) {
    setInputs((currentValues) => {
      return {
        ...currentValues,
        [input]: { value: inputValue, isValid: true },
      };
    });
  }

  async function submitHandler() {
    const pseudoIsValid = inputs.pseudo.value.trim().length >= 5;
    const firstnameIsValid = inputs.firstname.value.trim().length >= 3;
    const lastnameIsValid = inputs.lastname.value.trim().length >= 3;
    const passwordIsValid = validatePassword(inputs.password.value);
    const phoneIsValid = inputs.phoneNumber.value.length >= 10;
    const emailIsValid = validateEmail(inputs.email.value);
    const streetNameIsValid = inputs.streetName.value.length >= 3;
    const streetNumberIsValid = inputs.streetNumber.value.length > 0;
    const zipCodeIsValid = inputs.zipCode.value.length === 4;
    const locationIsValid = inputs.location.value.length >= 3;

    if (
      !pseudoIsValid ||
      !firstnameIsValid ||
      !lastnameIsValid ||
      !passwordIsValid ||
      !phoneIsValid ||
      !emailIsValid ||
      !streetNameIsValid ||
      !streetNumberIsValid ||
      !zipCodeIsValid ||
      !locationIsValid
    ) {
      setInputs((currInputs) => {
        return {
          pseudo: { value: currInputs.pseudo.value, isValid: pseudoIsValid },
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
          password: {
            value: currInputs.password.value,
            isValid: passwordIsValid,
          },
          streetName: {
            value: currInputs.streetName.value,
            isValid: streetNameIsValid,
          },
          streetNumber: {
            value: currInputs.streetNumber.value,
            isValid: streetNumberIsValid,
          },
          zipCode: { value: currInputs.zipCode.value, isValid: zipCodeIsValid },
          location: {
            value: currInputs.location.value,
            isValid: locationIsValid,
          },
        };
      });
      return;
    }

    try {
      setIsAuthenticating(true);
      const token = await createUser(
        inputs.pseudo.value,
        inputs.lastname.value,
        inputs.firstname.value,
        inputs.streetName.value,
        inputs.streetNumber.value,
        inputs.email.value,
        inputs.password.value,
        inputs.phoneNumber.value,
        inputs.zipCode.value,
        inputs.location.value
      );
      dispatch(authenticate(token, inputs.pseudo.value));
    } catch (e) {
      if (e.response?.data === "Pseudo already used") {
        Alert.alert(
          "Erreur",
          `Le pseudo "${inputs.pseudo.value}" est déjà utilisé. Veuillez en choisir un autre.`
        );
      } else if (e.response?.data === "User whith this email already exists") {
        Alert.alert("Erreur", "Un compte est déjà associé à cet email…");
      } else {
        Alert.alert("Erreur", "Création du compte impossible…");
      }
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingSpinner message="Création du compte…" />;
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container}>
        <View style={styles.extraContainer}>
          <Input
            label="Pseudo"
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, "pseudo"),
              value: inputs.pseudo.value,
              maxLength: 20,
            }}
            errorMsg={inputs.pseudo.isValid ? null : "Minimum 5 caractères."}
          />
          <Input
            label="Prénom"
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, "firstname"),
              value: inputs.firstname.value,
              maxLength: 30,
            }}
            errorMsg={inputs.firstname.isValid ? null : "Minimum 3 caractères."}
          />
          <Input
            label="Nom"
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, "lastname"),
              value: inputs.lastname.value,
              maxLength: 30,
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
            }}
            errorMsg={inputs.email.isValid ? null : "Email invalide."}
          />
          <Input
            label="Mot de passe"
            isPassword
            textInputConfig={{
              onChangeText: inputChangeHandler.bind(this, "password"),
              value: inputs.password.value,
              secureTextEntry: true,
              maxLength: 25,
            }}
            errorMsg={inputs.password.isValid ? null : "Minimum 7 caractères dont 1 chiffre."}
          />
          <TextSeparator>Adresse</TextSeparator>
          <View style={styles.inputRow}>
            <Input
              label="Rue"
              style={[styles.rowBig]}
              textInputConfig={{
                onChangeText: inputChangeHandler.bind(this, "streetName"),
                value: inputs.streetName.value,
                maxLength: 40,
              }}
              errorMsg={inputs.streetName.isValid ? null : " "}
            />
            <Input
              label="Numéro"
              style={[styles.rowSmall]}
              textInputConfig={{
                onChangeText: inputChangeHandler.bind(this, "streetNumber"),
                value: inputs.streetNumber.value,
                keyboardType: "numeric",
                maxLength: 4,
              }}
              errorMsg={inputs.streetNumber.isValid ? null : " "}
            />
          </View>
          <View style={styles.inputRow}>
            <Input
              label="Code Postal"
              style={[styles.rowSmall]}
              textInputConfig={{
                onChangeText: inputChangeHandler.bind(this, "zipCode"),
                value: inputs.zipCode.value,
                keyboardType: "number-pad",
                maxLength: 4,
              }}
              errorMsg={inputs.zipCode.isValid ? null : " "}
            />
            <Input
              label="Localité"
              style={[styles.rowBig]}
              textInputConfig={{
                onChangeText: inputChangeHandler.bind(this, "location"),
                value: inputs.location.value,
                maxLength: 40,
              }}
              errorMsg={inputs.location.isValid ? null : " "}
            />
          </View>

          <Button type="primary" style={{ marginTop: 30 }} onPress={submitHandler}>
            Valider
          </Button>
          <View style={styles.rowContainer}>
            <Text style={{ color: theme.colors.text }}>Déjà un compte ?</Text>
            <TextButton onPress={() => navigation.navigate("Login")}>Connexion</TextButton>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  extraContainer: {
    paddingBottom: 30,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowBig: {
    flex: 5,
  },
  rowSmall: {
    flex: 2,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});
