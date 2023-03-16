import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Select } from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../utils/colors";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getToken } from "../store/redux/selectors";
import { getAllLocations } from "../utils/api";

function LocationSelect({ onLocationChange, location }) {
  const token = useSelector(getToken);
  const [locations, setLocations] = useState();

  useEffect(() => {
    getAllLocations(token).then((value) => {
      setLocations(value);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons
        name="navigate"
        size={20}
        color={Colors.gray400}
        style={styles.navIcon}
      />
      <Select
        selectedValue={location}
        minWidth="200"
        borderWidth="2"
        borderRadius="md"
        borderColor="transparent"
        accessibilityLabel={location}
        placeholder={location}
        _selectedItem={{
          bg: Colors.primary100,
        }}
        color={Colors.gray400}
        mt={1}
        ml={5}
        style={styles.dropdown}
        onValueChange={onLocationChange}
        _dark={{ bg: "amber" }}
      >
        {locations &&
          locations.map((location) => (
            <Select.Item
              label={location.city}
              value={location.city}
              key={`${location.zipcode}${location.city}`}
            />
          ))}
      </Select>
    </View>
  );
}

export default LocationSelect;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    position: "relative",
    justifyContent: "center",
  },
  dropdown: {
    fontSize: 15,
    padding: 0,
  },
  navIcon: {
    position: "absolute",
    left: 5,
    paddingTop: 3,
  },
});
