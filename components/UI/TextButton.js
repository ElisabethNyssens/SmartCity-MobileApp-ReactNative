import { Pressable, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";

function TextButton({ children, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default TextButton;

const styles = StyleSheet.create({
  button: {
    border: "none",
    padding: 8,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.primary500,
  },
});
