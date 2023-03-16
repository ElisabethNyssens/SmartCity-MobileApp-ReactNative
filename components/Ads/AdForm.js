import { View, StyleSheet, ScrollView, Text, Platform, Pressable, Alert } from "react-native";
import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { getCurrentUser, getToken } from "../../store/redux/selectors";
import { Select, Checkbox } from "native-base";
import Input from "../UI/Input";
import Button from "../UI/Button";
import TextTheme from "../UI/TextTheme";
import TextSeparator from "../UI/TextSeparator";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Colors } from "../../utils/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import themeContext from "../../store/context/ThemeContext";
import { createAd } from "../../utils/api";

function AdForm() {
  const theme = useContext(themeContext);
  const currentUser = useSelector(getCurrentUser);
  const token = useSelector(getToken);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState("Toute la journée");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [userAddressChecked, setUserAddressChecked] = useState(false);
  const initialInputs = {
    title: {
      value: "",
      isValid: true,
    },
    description: {
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
  };
  const [inputs, setInputs] = useState(initialInputs);

  function onDateChange(e, selectedDate) {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  }

  function showDatepicker() {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onDateChange,
      mode: "date",
      minimumDate: new Date(),
    });
  }

  function onAddressCheckChange(state) {
    if (state && currentUser.length === 0) {
      Alert.alert("Erreur", "Impossible de récupérer l'adresse");
    } else {
      setUserAddressChecked(state);
      setInputs((currentValues) => {
        return {
          ...currentValues,
          streetName: {
            value: state ? currentUser.streetname : "",
            isValid: true,
          },
          streetNumber: {
            value: state ? currentUser.streetnumber.toString() : "",
            isValid: true,
          },
          zipCode: {
            value: state ? currentUser.zipcodelocation.toString() : "",
            isValid: true,
          },
          location: {
            value: state ? currentUser.citylocation : "",
            isValid: true,
          },
        };
      });
    }
  }

  function inputChangeHandler(input, inputValue) {
    setInputs((currentValues) => {
      return {
        ...currentValues,
        [input]: { value: inputValue, isValid: true },
      };
    });
  }

  function submitHandler() {
    const titleIsValid = inputs.title.value.trim().length >= 3;
    const descriptionIsValid = inputs.description.value.trim().length >= 3;
    const streetNameIsValid = inputs.streetName.value.length >= 3;
    const streetNumberIsValid = inputs.streetNumber.value.length > 0;
    const zipCodeIsValid = inputs.zipCode.value.length === 4;
    const locationIsValid = inputs.location.value.length >= 3;

    if (
      !titleIsValid ||
      !descriptionIsValid ||
      !streetNameIsValid ||
      !streetNumberIsValid ||
      !zipCodeIsValid ||
      !locationIsValid
    ) {
      setInputs((currInputs) => {
        return {
          title: { value: currInputs.title.value, isValid: titleIsValid },
          description: {
            value: currInputs.description.value,
            isValid: descriptionIsValid,
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

    setIsSubmitting(true);
    createAd(
      currentUser.pseudo,
      inputs.title.value,
      inputs.description.value,
      date,
      availability,
      inputs.streetName.value,
      inputs.streetNumber.value,
      inputs.zipCode.value,
      inputs.location.value,
      token
    ).then((response) => {
      if (response === "OK") {
        Alert.alert("Succès", "L'annonce a bien été créée !");
        reset();
      }
    });

    setIsSubmitting(false);
  }

  function reset() {
    setInputs(initialInputs);
    setDate(new Date());
    setUserAddressChecked(false);
    setAvailability("Toute la journée");
  }

  if (isSubmitting) {
    return <LoadingSpinner message="Création de l'annonce…" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Input
        label="Titre"
        textInputConfig={{
          onChangeText: inputChangeHandler.bind(this, "title"),
          value: inputs.title.value,
          editable: true,
          maxLength: 40,
        }}
        errorMsg={inputs.title.isValid ? null : " "}
      />
      <Input
        label="Description"
        textInputConfig={{
          onChangeText: inputChangeHandler.bind(this, "description"),
          value: inputs.description.value,
          multiline: true,
          editable: true,
          maxLength: 500,
        }}
        errorMsg={inputs.description.isValid ? null : " "}
      />
      <TextSeparator>Date</TextSeparator>
      <View style={styles.inputRow}>
        <View style={styles.datePicker}>
          {Platform.OS === "android" && (
            <View style={[styles.dateBtn, { backgroundColor: theme.colors.tile }]}>
              <Pressable onPress={showDatepicker}>
                <TextTheme style={styles.dateText}>{date.toLocaleDateString()}</TextTheme>
              </Pressable>
            </View>
          )}
          {Platform.OS === "ios" && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              onChange={onDateChange}
              minimumDate={new Date()}
              themeVariant={theme.dark ? "dark" : "light"}
              accentColor={Colors.primary500}
            />
          )}
        </View>
        <View style={styles.dropdownContainer}>
          <Select
            selectedValue={availability}
            minWidth="200"
            borderWidth="1.5"
            borderRadius="md"
            borderColor={Colors.gray400}
            accessibilityLabel="Disponibilité"
            placeholder="Disponibilité"
            _selectedItem={{
              bg: Colors.primary100,
            }}
            color={theme.colors.text}
            mt={1}
            style={styles.dropdown}
            onValueChange={(itemValue) => setAvailability(itemValue)}
          >
            <Select.Item label="Matin" value="Matin" />
            <Select.Item label="Après-midi" value="Après-midi" />
            <Select.Item label="Soirée" value="Soirée" />
            <Select.Item label="Toute la journée" value="Toute la journée" />
          </Select>
        </View>
      </View>
      <TextSeparator>Adresse</TextSeparator>
      <Checkbox
        value={userAddressChecked}
        isChecked={userAddressChecked}
        accessibilityLabel="Utiliser mon adresse"
        bgColor="transparent"
        borderColor={Colors.gray400}
        borderWidth="1.5"
        _text={{ color: theme.colors.text }}
        _checked={{
          borderColor: Colors.primary500,
          bgColor: Colors.primary500,
        }}
        m={2}
        onChange={onAddressCheckChange}
      >
        Utiliser mon adresse
      </Checkbox>
      <View style={styles.inputRow}>
        <Input
          label="Rue"
          style={[styles.rowBig]}
          textInputConfig={{
            onChangeText: inputChangeHandler.bind(this, "streetName"),
            value: inputs.streetName.value,
            editable: !userAddressChecked,
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
            editable: !userAddressChecked,
            maxLength: 4,
            keyboardType: "numeric",
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
            editable: !userAddressChecked,
            keyboardType: "numeric",
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
            editable: !userAddressChecked,
            maxLength: 40,
          }}
          errorMsg={inputs.location.isValid ? null : " "}
        />
      </View>
      <View style={styles.btnRow}>
        <Button type="secondary" style={styles.btn} onPress={reset}>
          Annuler
        </Button>
        <Button type="primary" style={styles.btn} onPress={submitHandler}>
          Publier
        </Button>
      </View>
    </ScrollView>
  );
}

export default AdForm;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    padding: 10,
  },
  dropdownContainer: {
    marginBottom: 10,
    marginHorizontal: 5,
  },
  dropdown: {
    fontSize: 16,
    padding: 0,
    margin: 0,
    border: "none",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
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
  datePicker: {
    margin: 5,
  },
  dateText: {
    fontSize: 16,
    textAlign: "center",
  },
  dateBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginVertical: 5,
  },
  btn: {
    minWidth: 0,
    marginTop: 30,
    marginBottom: 50,
  },
});
