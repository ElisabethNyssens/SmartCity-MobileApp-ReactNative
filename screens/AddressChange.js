import { View, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getToken, getCurrentUser } from "../store/redux/selectors";
import { updateLocalUser } from "../store/redux/actions/auth";
import { updateUserAddress } from "../utils/api";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import LoadingSpinner from "../components/UI/LoadingSpinner";

function AddressChange() {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const currentUser = useSelector(getCurrentUser);
  const [isDataUpdating, setIsDataUpdating] = useState(false);
  const initialInputs = {
    streetname: {
      value: currentUser.streetname || "",
      isValid: true,
    },
    streetnumber: {
      value: currentUser.streetnumber?.toString() || "",
      isValid: true,
    },
    zipcodelocation: {
      value: currentUser.zipcodelocation?.toString() || "",
      isValid: true,
    },
    citylocation: {
      value: currentUser.citylocation || "",
      isValid: true,
    },
  };
  const [inputs, setInputs] = useState(initialInputs);

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
      setIsDataUpdating(false);
      return;
    }
    const streetNameIsValid = inputs.streetname.value.length >= 3;
    const streetNumberIsValid = inputs.streetnumber.value.length > 0;
    const zipCodeIsValid = inputs.zipcodelocation.value.length === 4;
    const locationIsValid = inputs.citylocation.value.length >= 3;

    if (!streetNameIsValid || !streetNumberIsValid || !zipCodeIsValid || !locationIsValid) {
      setInputs((currInputs) => {
        return {
          streetname: {
            value: currInputs.streetname.value,
            isValid: streetNameIsValid,
          },
          streetnumber: {
            value: currInputs.streetnumber.value,
            isValid: streetNumberIsValid,
          },
          zipcodelocation: {
            value: currInputs.zipcodelocation.value,
            isValid: zipCodeIsValid,
          },
          citylocation: {
            value: currInputs.citylocation.value,
            isValid: locationIsValid,
          },
        };
      });
      return;
    }

    if (
      inputs.streetname.value === initialInputs.streetname.value &&
      inputs.streetnumber.value === initialInputs.streetnumber.value &&
      inputs.zipcodelocation.value === initialInputs.zipcodelocation.value &&
      inputs.citylocation.value === initialInputs.citylocation.value
    ) {
      Alert.alert("Attention", "Aucune donnée à modifier…");
      return;
    }

    try {
      setIsDataUpdating(true);
      await updateUserAddress(
        currentUser.pseudo,
        inputs.streetname.value,
        inputs.streetnumber.value,
        inputs.zipcodelocation.value,
        inputs.citylocation.value,
        token
      );
      const updatedUser = {
        ...currentUser,
        streetname: inputs.streetname.value,
        streetnumber: inputs.streetnumber.value,
        zipcodelocation: inputs.zipcodelocation.value,
        citylocation: inputs.citylocation.value,
      };
      dispatch(updateLocalUser(updatedUser));
      Alert.alert("Modification adresse", "L'adresse a bien été mise à jour!");
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'effectuer les modifications…");
      setInputs(initialInputs);
    }
    setIsDataUpdating(false);
  }

  if (isDataUpdating) {
    return <LoadingSpinner message="Modifications en cours..." />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Input
          label="Rue"
          style={[styles.rowBig]}
          textInputConfig={{
            onChangeText: inputChangeHandler.bind(this, "streetname"),
            value: inputs.streetname.value,
            maxLength: 40,
          }}
          errorMsg={inputs.streetname.isValid ? null : " "}
        />
        <Input
          label="Numéro"
          style={[styles.rowSmall]}
          textInputConfig={{
            onChangeText: inputChangeHandler.bind(this, "streetnumber"),
            value: inputs.streetnumber.value,
            keyboardType: "numeric",
            maxLength: 4,
          }}
          errorMsg={inputs.streetnumber.isValid ? null : " "}
        />
      </View>
      <View style={styles.inputRow}>
        <Input
          label="Code Postal"
          style={[styles.rowSmall]}
          textInputConfig={{
            onChangeText: inputChangeHandler.bind(this, "zipcodelocation"),
            value: inputs.zipcodelocation.value,
            keyboardType: "number-pad",
            maxLength: 4,
          }}
          errorMsg={inputs.zipcodelocation.isValid ? null : " "}
        />
        <Input
          label="Localité"
          style={[styles.rowBig]}
          textInputConfig={{
            onChangeText: inputChangeHandler.bind(this, "citylocation"),
            value: inputs.citylocation.value,
            maxLength: 40,
          }}
          errorMsg={inputs.citylocation.isValid ? null : " "}
        />
      </View>
      <Button onPress={submitHandler} type="primary" style={{ marginBottom: 60, marginTop: 30 }}>
        Enregistrer
      </Button>
    </View>
  );
}

export default AddressChange;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  rowBig: {
    flex: 5,
  },
  rowSmall: {
    flex: 2,
  },
});
