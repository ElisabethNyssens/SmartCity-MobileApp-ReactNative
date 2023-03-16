import { Alert, Pressable } from "react-native";
import { useState, useContext } from "react";
import SettingsBtn from "../components/Settings/SettingsBtn";
import SettingsSwitchBtn from "../components/Settings/SettingsSwitchBtn";
import themeContext from "../store/context/ThemeContext";
import { EventRegister } from "react-native-event-listeners";
import { useDispatch } from "react-redux";
import { logout } from "../store/redux/actions/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const theme = useContext(themeContext);
  const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);

  function toggleSwitch(value) {
    EventRegister.emit("switchTheme", value);
    AsyncStorage.setItem("isDarkTheme", isDarkTheme ? "false" : "true");
    setIsDarkTheme((isDarkTheme) => !isDarkTheme);
  }

  function logoutHandler() {
    Alert.alert("Attention", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Oui",
        onPress: () => {
          dispatch(logout());
        },
        style: "destructive",
      },
      {
        text: "Non",
        style: "default",
      },
    ]);
  }

  return (
    <>
      <SettingsBtn onPress={() => navigation.navigate("AccountSettings")} rightArrow>
        Paramètres du compte
      </SettingsBtn>
      <SettingsBtn onPress={() => navigation.navigate("History")} rightArrow>
        Historique
      </SettingsBtn>
      <SettingsSwitchBtn action={toggleSwitch} switchValue={isDarkTheme} rightArrow>
        Mode Sombre
      </SettingsSwitchBtn>
      <SettingsBtn leftIcon="exit-outline" onPress={logoutHandler}>
        Déconnexion
      </SettingsBtn>
    </>
  );
}

export default SettingsScreen;
