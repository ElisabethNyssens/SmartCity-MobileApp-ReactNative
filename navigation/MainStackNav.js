import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../utils/colors";
import { useContext } from "react";
import themeContext from "../store/context/ThemeContext";

import BottomTabNav from "./BottomTabNav";
// Screens
import SettingsScreen from "../screens/SettingsScreen";
import History from "../screens/History";
import AccountSettings from "../screens/AccountSettings";
import SubscriptionsScreen from "../screens/SubscriptionsScreen";
import SearchScreen from "../screens/SearchScreen";
import PearlsScreen from "../screens/PearlsScreen";
import AdDetailScreen from "../screens/AdDetailScreen";
import OtherProfileScreen from "../screens/OtherProfileScreen";
import PasswordChange from "../screens/PasswordChange";
import AddressChange from "../screens/AddressChange";
import NewReviewScreen from "../screens/NewReviewScreen";

const Stack = createNativeStackNavigator();

function MainStackNav() {
  const theme = useContext(themeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBg,
        },
        headerTintColor: Colors.primary50,
      }}
    >
      <Stack.Screen
        name="BottomTab"
        component={BottomTabNav}
        options={{
          headerShown: false,
          title: "Profil",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Paramètres",
          headerBackTitle: "Profil",
        }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{
          title: "Paramètres du compte",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{
          title: "Historique",
        }}
      />
      <Stack.Screen
        name="OtherProfile"
        component={OtherProfileScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={{
          headerBackTitle: "Profil",
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: "Recherche",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="Pearls"
        component={PearlsScreen}
        options={{
          title: "Perles",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="AdDetail"
        component={AdDetailScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AddressChange"
        component={AddressChange}
        options={{
          title: "Modifier adresse",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="PasswordChange"
        component={PasswordChange}
        options={{
          title: "Modifier mot de passe",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Review"
        component={NewReviewScreen}
        options={{
          title: "Laisser une évaluation",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}

export default MainStackNav;
