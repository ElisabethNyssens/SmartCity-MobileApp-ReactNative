import { View, StyleSheet, Pressable, Text } from "react-native";
import { Avatar, Skeleton } from "native-base";
import { useEffect, useState } from "react";
import {
  getCurrentUserPseudo,
  getCurrentUserSubscriptions,
  getToken,
} from "../../store/redux/selectors";
import { useSelector } from "react-redux";
import { useContext } from "react";
import Button from "../UI/Button";
import { Colors } from "../../utils/colors";
import { getUser } from "../../utils/api";
import { useNavigation } from "@react-navigation/native";
import themeContext from "../../store/context/ThemeContext";
import TextTheme from "../UI/TextTheme";
import AvatarTile from "../UI/AvatarTile";

function SubscripTile({ pseudo, follow, unFollow }) {
  const token = useSelector(getToken);
  const theme = useContext(themeContext);
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState();

  const currentUserPseudo = useSelector(getCurrentUserPseudo);
  const userSubscriptions = useSelector(getCurrentUserSubscriptions);

  const isCurrentUser = currentUserPseudo === pseudo;

  useEffect(() => {
    getUser(pseudo, token).then((value) => {
      setUser(value);
    });
  }, []);

  useEffect(() => {
    setIsFollowing(userSubscriptions.includes(pseudo));
  }, [isFollowing, userSubscriptions, user]);

  if (!user) {
    return (
      <Skeleton
        style={styles.skeleton}
        startColor={theme.colors.tile}
        endColor="transparent"
      />
    );
  }
  return (
    <Pressable
      onPress={() => {
        if (currentUserPseudo === user.pseudo) {
          navigation.navigate("BottomTab");
        } else {
          navigation.push("OtherProfile", {
            user,
          });
        }
      }}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View
        style={[
          styles.container,
          styles.row,
          { backgroundColor: theme.colors.tile },
        ]}
      >
        <AvatarTile
          name={user.name}
          firstname={user.firstname}
          pseudo={pseudo}
        />
        {!isCurrentUser && isFollowing && (
          <Button
            style={styles.button}
            textStyle={styles.textButton}
            type="secondary"
            onPress={unFollow}
          >
            Ne plus suivre
          </Button>
        )}
        {!isCurrentUser && !isFollowing && (
          <Button
            style={styles.button}
            textStyle={styles.textButton}
            type="primary"
            onPress={follow}
          >
            Suivre
          </Button>
        )}
      </View>
    </Pressable>
  );
}

export default SubscripTile;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 10,
  },
  textButton: {
    fontSize: 12,
  },
  button: {
    marginRight: 0,
    marginVertical: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 0,
    borderWidth: 1.5,
  },
  pseudo: {
    fontSize: 12,
  },
  skeleton: {
    marginTop: 10,
    paddingHorizontal: 10,
    height: 55,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});
