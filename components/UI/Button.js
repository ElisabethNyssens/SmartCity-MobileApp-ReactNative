import { Pressable, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";

function Button({ type, children, style, textStyle, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed, disabled && styles.disabled]}
      disabled={disabled ?? false}
    >
      <View
        style={[
          styles.button,
          type === "primary" && styles.btnPrimary,
          type === "secondary" && styles.btnSecondary,
          type === "danger" && styles.btnDanger,
          style && style,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            type === "primary" && styles.textBtn,
            type === "secondary" && styles.textSecondary,
            type === "danger" && styles.textBtn,
            textStyle && textStyle,
          ]}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    minWidth: 200,
    alignSelf: "center",
    borderWidth: 2,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  btnPrimary: {
    backgroundColor: Colors.primary500,
    borderColor: Colors.primary500,
  },
  btnDanger: {
    backgroundColor: Colors.error500,
    borderColor: Colors.error500,
  },
  btnSecondary: {
    backgroundColor: "transparent",
    borderColor: Colors.primary500,
  },
  textBtn: {
    color: "white",
  },
  textSecondary: {
    color: Colors.primary500,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
});
