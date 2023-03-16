import { Text, View, Pressable, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useState, useContext, useEffect, useCallback } from "react";
import TextTheme from "../UI/TextTheme";
import { Ionicons } from "@expo/vector-icons";
import AboutTiles from "./AboutTiles";
import TextIconButton from "../UI/TextIconButton";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../../store/redux/selectors";
import themeContext from "../../store/context/ThemeContext";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function ProfileAboutTab({ route, navigation }) {
  const theme = useContext(themeContext);
  const currentUser = useSelector(getCurrentUser);
  const [user, setUser] = useState(route.params.user);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setUser(route.params.user.pseudo === currentUser.pseudo ? currentUser : route.params.user);
  }, [currentUser]);

  const refreshHandler = useCallback(() => {
    setRefresh(true);
    wait(1500).then(() => setRefresh(false));
  }, []);

  return (
    <ScrollView
      style={styles.tabContainer}
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshHandler} />}
    >
      <AboutTiles userPseudo={user.pseudo} refresh={refresh} />
      <View style={styles.iconAndTextContainer}>
        <Ionicons style={styles.icon} name="location-outline" size={24} color={theme.colors.text} />
        <TextTheme>
          {user.citylocation || "Ville inconnue"},
          {user.citylocation ? " Belgique" : " au pays des merveilles"}
        </TextTheme>
      </View>
      <View>
        {user.description && (
          <View style={styles.bioContainer}>
            <Ionicons style={styles.icon} name="book-outline" size={24} color={theme.colors.text} />
            <TextTheme style={styles.userDescription}>{user.description}</TextTheme>
          </View>
        )}
        {!user.description && user.pseudo === currentUser.pseudo && (
          <TextIconButton
            icon="add-circle-outline"
            onPress={() => navigation.navigate("AccountSettings")}
          >
            Ajouter minibio
          </TextIconButton>
        )}
      </View>
    </ScrollView>
  );
}

export default ProfileAboutTab;

const styles = StyleSheet.create({
  tabContainer: {
    padding: 10,
  },
  iconAndTextContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginEnd: 10,
  },
  bioButton: {
    // borderColor: "gray",
    // borderWidth: 1,
    // borderRadius: 3,
  },
  bioContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    flexShrink: 1,
    overflow: "hidden",
    // flex: 1,
    // flexWrap: "wrap",
    // maxWidth: "100%",
  },
  userDescription: {
    flexShrink: 1,
    // flex: 1,
    // flexWrap: "wrap",
  },
  btnText: {
    color: "gray",
  },
});
