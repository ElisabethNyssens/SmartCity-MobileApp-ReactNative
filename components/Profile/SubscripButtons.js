import { Pressable, View, Text, StyleSheet } from "react-native";
import TextTheme from "../UI/TextTheme";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getCurrentUserSubscriptions,
  getToken,
} from "../../store/redux/selectors";
import { useNavigation } from "@react-navigation/native";
import themeContext from "../../store/context/ThemeContext";
import { getSubscribers, getSubscriptions } from "../../utils/api";

function SubscripButtons({ userPseudo }) {
  const token = useSelector(getToken);
  const navigation = useNavigation();
  const theme = useContext(themeContext);

  const currentUserSubscriptions = useSelector(getCurrentUserSubscriptions);
  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    getSubscribers(userPseudo, token).then((value) => {
      setSubscribers(value.map((val) => val.pseudosubscriber));
    });
    getSubscriptions(userPseudo, token).then((value) => {
      setSubscriptions(value.map((val) => val.pseudosubscription));
    });
  }, [currentUserSubscriptions]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          navigation.push("Subscriptions", {
            subscriptions: subscribers,
            isSubscribers: true,
          })
        }
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.btnContainer}>
          <TextTheme style={styles.number}>{subscribers.length}</TextTheme>
          <TextTheme styles={{ color: theme.colors.text }}>abonnés</TextTheme>
        </View>
      </Pressable>
      <Pressable
        onPress={() =>
          navigation.push("Subscriptions", {
            subscriptions,
            isSubscribers: false,
            userPseudo,
          })
        }
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.btnContainer}>
          <TextTheme style={styles.number}>{subscriptions.length}</TextTheme>
          <TextTheme>abonnements</TextTheme>
        </View>
      </Pressable>
    </View>
  );
}

export default SubscripButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  btnContainer: {
    marginTop: 20,

    marginHorizontal: 20,
    alignItems: "center",
  },
  number: {
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.6,
  },
});
