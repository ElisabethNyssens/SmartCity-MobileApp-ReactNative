import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";
import { useContext } from "react";
import themeContext from "../../store/context/ThemeContext";

function TextSeparator({ children }) {
  const theme = useContext(themeContext);
  return (
    <View style={styles.container}>
      <View style={styles.line}></View>
      <Text style={[styles.text, { color: theme.colors.text }]}>
        {children}
      </Text>
      <View style={styles.line}></View>
    </View>
  );
}

export default TextSeparator;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    paddingHorizontal: 30,
    color: Colors.gray400,
    fontSize: 17,
  },
  line: {
    height: 1.5,
    flex: 1,
    backgroundColor: Colors.gray400,
  },
});
