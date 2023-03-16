import { FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentUserPseudo,
  getCurrentUserSubscriptions,
  getToken,
} from "../store/redux/selectors";
import { updateSubscriptions } from "../store/redux/actions/auth";
import SubscripTile from "../components/Subscriptions/SubscripTile";
import { addSubscription, removeSubscription } from "../utils/api";
import TextTheme from "../components/UI/TextTheme";

function SubscriptionsScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const [subscriptions, setSubscriptions] = useState(route.params.subscriptions);
  const token = useSelector(getToken);
  const userPseudo = route.params.userPseudo;
  const isSubscribers = route.params.isSubscribers;
  const currentUserPseudo = useSelector(getCurrentUserPseudo);
  const currentUserSubscriptions = useSelector(getCurrentUserSubscriptions);

  useEffect(() => {
    navigation.setOptions({
      title: isSubscribers ? "Abonnés" : "Abonnements",
    });
  }, [navigation]);

  const renderItem = ({ item }) => {
    async function followHandler() {
      await addSubscription(currentUserPseudo, item, token);
      const newSubscriptions = [...currentUserSubscriptions];
      newSubscriptions.push(item);
      dispatch(updateSubscriptions(newSubscriptions));
    }

    async function unFollowHandler() {
      await removeSubscription(currentUserPseudo, item, token);
      const newSubscriptions = currentUserSubscriptions.filter((pseudo) => pseudo !== item);
      dispatch(updateSubscriptions(newSubscriptions));
      if (userPseudo === currentUserPseudo && !isSubscribers) {
        setSubscriptions((prevState) => prevState.filter((pseudo) => pseudo !== item));
      }
    }
    return <SubscripTile pseudo={item} follow={followHandler} unFollow={unFollowHandler} />;
  };

  return (
    <FlatList
      data={subscriptions}
      style={styles.list}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      ListEmptyComponent={() => (
        <TextTheme style={styles.fallbackText}>
          Aucun {isSubscribers ? "abonné" : "abonnement"}
        </TextTheme>
      )}
    />
  );
}

export default SubscriptionsScreen;

const styles = StyleSheet.create({
  list: {
    overflow: "visible",
    marginBottom: 10,
  },
  fallbackText: {
    textAlign: "center",
    padding: 30,
  },
});
