import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../utils/colors";

//  Screens
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignInScreen from "../screens/SignInScreen";

const Stack = createNativeStackNavigator();

function AuthStackNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary500,
        },
        headerTintColor: Colors.gray50,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Se connecter",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Signin"
        component={SignInScreen}
        options={{
          title: "Créer un compte",
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthStackNav;
