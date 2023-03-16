import { View, StyleSheet } from "react-native";
import { VStack } from "native-base";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import TextTheme from "../UI/TextTheme";
import themeContext from "../../store/context/ThemeContext";

function AdInfo({ location, date }) {
  const theme = useContext(themeContext);
  return (
    <VStack space={1}>
      <View style={styles.row}>
        <Ionicons
          style={styles.icon}
          name="location"
          size={17}
          color={theme.colors.text}
        />
        <TextTheme>{location}</TextTheme>
      </View>
      <View style={styles.row}>
        <Ionicons
          style={styles.icon}
          name="calendar"
          size={17}
          color={theme.colors.text}
        />
        <TextTheme>Posté le {date.toLocaleDateString()}</TextTheme>
      </View>
    </VStack>
  );
}

export default AdInfo;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  icon: {
    marginRight: 5,
  },
});
