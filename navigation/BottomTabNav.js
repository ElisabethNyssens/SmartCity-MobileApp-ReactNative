import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext } from "react";
import themeContext from "../store/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../utils/colors";

// Screens
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import InProgressScreen from "../screens/InProgress";
import PublishScreen from "../screens/PublishScreen";

const Tab = createBottomTabNavigator();

function BottomTabNav() {
  const theme = useContext(themeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: Colors.gray400,
        headerStyle: {
          backgroundColor: theme.colors.headerBg,
        },
        headerTintColor: Colors.gray50,
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          title: "Parcourir",
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Publier"
        component={PublishScreen}
        options={{
          headerTitle: "Nouvelle annonce",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="En cours"
        component={InProgressScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNav;
