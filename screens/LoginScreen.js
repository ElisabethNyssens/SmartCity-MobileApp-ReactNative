import { TextInput, View, Text, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import TextButton from "../components/UI/TextButton";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { login } from "../utils/api";
import { useDispatch } from "react-redux";
import { authenticate } from "../store/redux/actions/auth";
import { Alert } from "react-native";
import { validatePassword } from "../utils/validation";
import themeContext from "../store/context/ThemeContext";

function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const theme = useContext(themeContext);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [inputs, setInputs] = useState({
    pseudo: {
      value: "",
      isValid: true,
    },
    password: {
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
    const passwordIsValid = validatePassword(inputs.password.value);

    if (!pseudoIsValid || !passwordIsValid) {
      setInputs((currInputs) => {
        return {
          pseudo: { value: currInputs.pseudo.value, isValid: pseudoIsValid },
          password: {
            value: currInputs.password.value,
            isValid: passwordIsValid,
          },
        };
      });
      return;
    }

    try {
      setIsAuthenticating(true);
      const token = await login(inputs.pseudo.value, inputs.password.value);
      dispatch(authenticate(token, inputs.pseudo.value));
    } catch (e) {
      if (e.response.data === "Pseudo not found") {
        Alert.alert("Erreur", "Pseudo incorrect");
      } else if (e.response.data === "Wrong password") {
        Alert.alert("Erreur", "Mot de passe incorrect");
      } else {
        Alert.alert("Erreur", "Connexion impossible…");
      }
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingSpinner message="Connexion en cours…" />;
  }

  return (
    <View style={styles.container}>
      <Input
        label="Pseudo"
        textInputConfig={{
          onChangeText: inputChangeHandler.bind(this, "pseudo"),
          value: inputs.pseudo.value,
          maxLength: 20,
          editable: true,
        }}
        errorMsg={inputs.pseudo.isValid ? null : "Minimum 5 caractères."}
      />
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
      <Button type="primary" style={{ marginTop: 30 }} onPress={submitHandler}>
        Connexion
      </Button>

      <View style={styles.rowContainer}>
        <Text style={{ color: theme.colors.text }}>Pas encore de compte ?</Text>
        <TextButton onPress={() => navigation.navigate("Signin")}>Inscription</TextButton>
      </View>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});
