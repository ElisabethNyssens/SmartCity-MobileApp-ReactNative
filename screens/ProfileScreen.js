import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import PearlsButton from "../components/UI/PearlsButton";
import SubscripButtons from "../components/Profile/SubscripButtons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "../utils/colors";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../store/redux/selectors";

import ProfileAdsTab from "../components/Profile/ProfileAdsTab";
import ProfileAboutTab from "../components/Profile/ProfileAboutTab";
import ProfileReviewsTab from "../components/Profile/ProfileReviewsTab";
import { Avatar } from "native-base";
import TextTheme from "../components/UI/TextTheme";

function ProfileScreen({ navigation }) {
  const currentUser = useSelector(getCurrentUser);
  const Tab = createMaterialTopTabNavigator();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable style={styles.settingsBtn} onPress={() => navigation.navigate("Settings")}>
            <Ionicons name={"settings-outline"} size={24} color={Colors.primary50} />
          </Pressable>
        );
      },
      headerLeft: () => {
        return <PearlsButton quantity={currentUser?.nbpearls ?? "?"} />;
      },
    });
  }, [navigation]);

  return (
    <>
      <View style={styles.introContainer}>
        <Avatar style={styles.avatar} bgColor={Colors.accent400} size="lg">
          {`${currentUser?.firstname?.slice(0, 1) || "X"}${currentUser?.name?.slice(0, 1) || "D"}`}
        </Avatar>
        <TextTheme>@{currentUser?.pseudo || "inconnu"}</TextTheme>
        <Text style={styles.name}>
          {currentUser?.firstname || "Poisson"} {currentUser?.name || "Pané"}
        </Text>
        <SubscripButtons userPseudo={currentUser?.pseudo} />
      </View>
      <Tab.Navigator
        style={styles.nav}
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, textTransform: "capitalize" },
          swipeEnabled: false,
        }}
      >
        <Tab.Screen
          name="ProfileAdsTab"
          component={ProfileAdsTab}
          options={{ title: "Annonces" }}
          initialParams={{
            user: currentUser.pseudo,
          }}
        />
        <Tab.Screen
          name="ProfileReviewsTab"
          component={ProfileReviewsTab}
          options={{ title: "Evaluations" }}
          initialParams={{
            user: currentUser.pseudo,
          }}
        />
        <Tab.Screen
          name="ProfileAboutTab"
          component={ProfileAboutTab}
          options={{ title: "À propos" }}
          initialParams={{
            user: currentUser,
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  settingsBtn: {
    marginRight: 10,
  },
  nav: {
    flex: 1,
  },
  introContainer: {
    alignItems: "center",
    margin: 10,
  },
  avatar: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.accent500,
  },
});
