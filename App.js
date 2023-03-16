import { useState, useEffect } from "react";
import { LogBox, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventRegister } from "react-native-event-listeners";
import { NativeBaseProvider } from "native-base";
import NetInfo from "@react-native-community/netinfo";
// Utils
import { Themes } from "./utils/themes";
import { getUser, getSubscriptions } from "./utils/api";
// Store
import themeContext from "./store/context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "./store/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { getIsAuthenticated } from "./store/redux/selectors";
import { authenticate, logout } from "./store/redux/actions/auth";
import { initUser } from "./store/redux/actions/auth";
// Nav
import { NavigationContainer } from "@react-navigation/native";
import MainStackNav from "./navigation/MainStackNav";
import AuthStackNav from "./navigation/AuthStackNav";

LogBox.ignoreLogs([
  "Remote debugger",
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
]);
SplashScreen.preventAutoHideAsync();

function StackNavContainer() {
  const dispatch = useDispatch();
  const [appIsReady, setAppIsReady] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const unsubscribe = NetInfo.addEventListener((state) => {
    if (!state.isConnected) {
      Alert.alert("Erreur", "Vérifiez votre connexion à Internet !");
    }
  });
  unsubscribe();

  useEffect(() => {
    let eventListener = EventRegister.addEventListener("switchTheme", (data) => {
      setIsDarkTheme(data);
    });
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  });

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      const currentUser = await AsyncStorage.getItem("user");
      const isLocalDarkTheme = await AsyncStorage.getItem("isDarkTheme");
      setIsDarkTheme(isLocalDarkTheme === "true" ? true : false);

      if (storedToken) {
        console.log(storedToken);
        const response = await getUser(currentUser, storedToken);
        console.log(response);
        if (response !== "jwt expired" && response !== []) {
          dispatch(authenticate(storedToken, currentUser));
          const user = response;
          let subscriptions = await getSubscriptions(currentUser, storedToken);
          subscriptions = subscriptions.map((s) => s.pseudosubscription);
          dispatch(initUser(user, subscriptions));
        } else {
          dispatch(logout());
        }
      }
      setAppIsReady(true);
    }
    fetchToken();
  }, [isAuthenticated]);

  if (appIsReady) {
    async function hideSplash() {
      await SplashScreen.hideAsync();
    }
    hideSplash();
  }

  return (
    <themeContext.Provider value={isDarkTheme ? Themes.dark : Themes.light}>
      <NativeBaseProvider>
        <NavigationContainer theme={isDarkTheme ? Themes.dark : Themes.light}>
          {isAuthenticated && <MainStackNav />}
          {!isAuthenticated && <AuthStackNav />}
        </NavigationContainer>
      </NativeBaseProvider>
    </themeContext.Provider>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <StackNavContainer />
      </Provider>
    </>
  );
}
