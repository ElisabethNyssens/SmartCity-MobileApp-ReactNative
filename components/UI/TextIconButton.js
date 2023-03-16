import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../utils/colors";

function TextIconButton({ icon, children, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.button}>
        {icon && (
          <Ionicons
            style={styles.icon}
            name={icon}
            size={25}
            color={Colors.gray400}
          />
        )}
        <Text style={[styles.buttonText]}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default TextIconButton;

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: Colors.gray400,
  },
  icon: {
    marginRight: 10,
  },
});
