import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { Colors } from "./colors";

export const Themes = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.gray50,
      text: Colors.primary900,
      primary: Colors.primary200,
      tile: Colors.gray100,
      headerBg: Colors.primary200,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.gray900,
      primary: Colors.primary700,
      text: Colors.gray200,
      tile: Colors.gray800,
      headerBg: Colors.primary700,
    },
  },
};
