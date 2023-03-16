import {
  Pressable,
  View,
  StyleSheet,
  Text,
  Switch,
  Platform,
} from "react-native";
import { useState, useContext } from "react";
import { Colors } from "../../utils/colors";
import themeContext from "../../store/context/ThemeContext";

function SettingsSwitchBtn({ children, switchValue, action }) {
  const theme = useContext(themeContext);
  const [isEnabled, setIsEnabled] = useState(switchValue);

  const toggleSwitch = (value) => {
    setIsEnabled(value);
    action(value);
  };

  return (
    <Pressable>
      <View
        style={[styles.container, { borderBottomColor: theme.colors.border }]}
      >
        <Text style={{ color: theme.colors.text }}>{children}</Text>
        <Switch
          onValueChange={toggleSwitch}
          value={isEnabled}
          trackColor={{ false: "#767577", true: Colors.primary500 }}
          thumbColor="white"
        />
      </View>
    </Pressable>
  );
}

export default SettingsSwitchBtn;

const styles = StyleSheet.create({
  container: {
    paddingVertical: Platform.OS === "android" ? 1 : 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },
});
