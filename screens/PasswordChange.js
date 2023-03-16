import { View, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getToken, getCurrentUser } from "../store/redux/selectors";
import { updateLocalUser } from "../store/redux/actions/auth";
import { updateUserPassword } from "../utils/api";
import { validatePassword } from "../utils/validation";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import LoadingSpinner from "../components/UI/LoadingSpinner";

function PasswordChange() {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const currentUser = useSelector(getCurrentUser);
  const [isDataUpdating, setIsDataUpdating] = useState(false);
  const initialInputs = {
    password: {
      value: "",
      isValid: true,
    },
    repeatPassword: {
      value: "",
      isValid: true,
    },
    samePasswords: true,
  };
  const [inputs, setInputs] = useState(initialInputs);

  function inputChangeHandler(input, inputValue) {
    setInputs((currentValues) => {
      return {
        ...currentValues,
        [input]: { value: inputValue, isValid: true },
        samePasswords: true,
      };
    });
  }

  async function submitHandler() {
    const passwordIsValid = validatePassword(inputs.password.value);
    const repeatPasswordIsValid = validatePassword(inputs.repeatPassword.value);
    const samePasswords = inputs.password.value === inputs.repeatPassword.value;

    if (!passwordIsValid || !repeatPasswordIsValid || !samePasswords) {
      setInputs((currInputs) => {
        return {
          password: {
            value: currInputs.password.value,
            isValid: passwordIsValid,
          },
          repeatPassword: {
            value: currInputs.repeatPassword.value,
            isValid: repeatPasswordIsValid,
          },
          samePasswords,
        };
      });
      return;
    }

    try {
      setIsDataUpdating(true);
      await updateUserPassword(currentUser.pseudo, inputs.password.value, token);
      const updatedUser = {
        ...currentUser,
        password: inputs.password.value,
      };
      dispatch(updateLocalUser(updatedUser));
      Alert.alert("Modification mot de passe", "Le mot de passe a bien été mise à jour!");
      setInputs(initialInputs);
    } catch (e) {
      Alert.alert("Erreur", "Impossible de mettre à jour le mot de passe…");
      setInputs(initialInputs);
    }
    setIsDataUpdating(false);
  }

  if (isDataUpdating) {
    return <LoadingSpinner message="Modifications en cours..." />;
  }
  return (
    <View style={styles.container}>
      <Input
        label="Mot de passe"
        isPassword
        textInputConfig={{
          onChangeText: inputChangeHandler.bind(this, "password"),
          value: inputs.password.value,
          maxLength: 25,
        }}
        errorMsg={inputs.password.isValid ? null : "Minimum 7 caractères dont 1 chiffre."}
      />
      <Input
        label="Répéter le mot de passe"
        isPassword
        textInputConfig={{
          onChangeText: inputChangeHandler.bind(this, "repeatPassword"),
          value: inputs.repeatPassword.value,
          maxLength: 25,
        }}
        errorMsg={
          inputs.password.isValid && inputs.samePasswords ? null : "Mot de passe incorrect."
        }
      />
      <Button onPress={submitHandler} type="primary" style={{ marginBottom: 60, marginTop: 30 }}>
        Enregistrer
      </Button>
    </View>
  );
}

export default PasswordChange;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});
