import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useLayoutEffect, useContext, useState, useEffect } from "react";
import Button from "../components/UI/Button";
import SubscripButtons from "../components/Profile/SubscripButtons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "../utils/colors";
import themeContext from "../store/context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentUserSubscriptions,
  getCurrentUserPseudo,
  getToken,
} from "../store/redux/selectors";
import { updateSubscriptions } from "../store/redux/actions/auth";
import { getUser } from "../utils/api";
import ProfileAdsTab from "../components/Profile/ProfileAdsTab";
import ProfileAboutTab from "../components/Profile/ProfileAboutTab";
import ProfileReviewsTab from "../components/Profile/ProfileReviewsTab";
import { Avatar } from "native-base";
import { addSubscription, removeSubscription } from "../utils/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";

function OtherProfileScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const theme = useContext(themeContext);
  const Tab = createMaterialTopTabNavigator();
  const [isFollowing, setIsFollowing] = useState();
  const token = useSelector(getToken);
  const userSubscriptions = useSelector(getCurrentUserSubscriptions);
  const currentUserPseudo = useSelector(getCurrentUserPseudo);
  const [user, setUser] = useState(route.params.user || null);
  const userPseudo = route.params.userPseudo || null;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `@${user?.pseudo || userPseudo}`,
    });
  }, [navigation, user]);

  useEffect(() => {
    if (user === null) {
      getUser(userPseudo, token).then((value) => {
        setUser(value);
      });
    }
  }, []);

  useEffect(() => {
    setIsFollowing(userSubscriptions.includes(user?.pseudo || userPseudo));
  }, [isFollowing, userSubscriptions, user]);

  async function followHandler() {
    await addSubscription(currentUserPseudo, user.pseudo, token);
    const newSubscriptions = [...userSubscriptions];
    newSubscriptions.push(user.pseudo);
    dispatch(updateSubscriptions(newSubscriptions));
  }

  async function unFollowHandler() {
    await removeSubscription(currentUserPseudo, user.pseudo, token);
    const newSubscriptions = userSubscriptions.filter((pseudo) => pseudo !== user.pseudo);
    dispatch(updateSubscriptions(newSubscriptions));
  }

  if (user === null) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <View style={styles.introContainer}>
        <Avatar style={styles.avatar} bgColor={Colors.accent400} size="lg">
          {`${user.firstname.slice(0, 1)}${user.name.slice(0, 1)}`}
        </Avatar>
        <Text style={{ color: theme.colors.text }}>@{user.pseudo}</Text>
        <Text style={[styles.name]}>
          {user.firstname} {user.name}
        </Text>
        {isFollowing && (
          <Button
            style={styles.button}
            textStyle={styles.textButton}
            type="secondary"
            onPress={unFollowHandler}
          >
            Ne plus suivre
          </Button>
        )}
        {!isFollowing && (
          <Button
            style={styles.button}
            textStyle={styles.textButton}
            type="primary"
            onPress={followHandler}
          >
            Suivre
          </Button>
        )}
        <SubscripButtons userPseudo={user.pseudo} />
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
            user: user.pseudo,
          }}
        />
        <Tab.Screen
          name="ProfileReviewsTab"
          component={ProfileReviewsTab}
          options={{ title: "Evaluations" }}
          initialParams={{
            user: user.pseudo,
          }}
        />
        <Tab.Screen
          name="ProfileAboutTab"
          component={ProfileAboutTab}
          options={{ title: "À propos" }}
          initialParams={{
            user,
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default OtherProfileScreen;

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
  button: {
    marginTop: 20,
    paddingVertical: 5,
  },
  textButton: {
    fontSize: 13,
  },
});
