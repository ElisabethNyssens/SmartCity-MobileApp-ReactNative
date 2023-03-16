import { Pressable, View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../utils/colors";
import { useContext } from "react";
import themeContext from "../../store/context/ThemeContext";

function SettingsBtn({ children, onPress, leftIcon, rightArrow }) {
  const theme = useContext(themeContext);

  return (
    <Pressable onPress={onPress}>
      <View
        style={[styles.container, { borderBottomColor: theme.colors.border }]}
      >
        <View style={styles.row}>
          {leftIcon && (
            <Ionicons
              style={styles.leftIcon}
              name={leftIcon}
              size={24}
              color={Colors.primary500}
            />
          )}
          <Text style={{ color: theme.colors.text }}>{children}</Text>
        </View>
        <View>
          {rightArrow && (
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={Colors.primary500}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default SettingsBtn;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftIcon: {
    marginRight: 10,
  },
});
