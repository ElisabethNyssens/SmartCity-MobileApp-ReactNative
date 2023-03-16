import { View, Text, StyleSheet } from "react-native";
import { Skeleton } from "native-base";
import { Colors } from "../../utils/colors";
import { useContext } from "react";
import themeContext from "../../store/context/ThemeContext";
import { theme } from "native-base";

function AboutTile({ counter, title }) {
  const theme = useContext(themeContext);

  return (
    <View style={[styles.tileContainer, { backgroundColor: theme.colors.tile }]}>
      <Text style={styles.counter}>{counter ?? "?"}</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
    </View>
  );
}

export default AboutTile;

const styles = StyleSheet.create({
  tileContainer: {
    margin: 5,
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  skeleton: {
    margin: 5,
    flex: 1,
    alignItems: "center",
  },
  counter: {
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.accent500,
  },
  title: {
    textAlign: "center",
    // color: Colors.primary800,
  },
});
