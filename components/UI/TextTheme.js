import { useContext } from "react";
import { Text } from "react-native";
import themeContext from "../../store/context/ThemeContext";

function TextTheme({ children, style }) {
  const theme = useContext(themeContext);

  return <Text style={[style, { color: theme.colors.text }]}>{children}</Text>;
}

export default TextTheme;
