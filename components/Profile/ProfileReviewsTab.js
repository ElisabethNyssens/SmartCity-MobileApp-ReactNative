import { Pressable, View, FlatList, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";
import { useContext, useEffect, useState, useCallback } from "react";
import themeContext from "../../store/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { getAllReviewsByUser } from "../../utils/api";
import { getToken, getCurrentUserPseudo } from "../../store/redux/selectors";
import { useSelector } from "react-redux";
import StarRating from "./StarRating";
import TextTheme from "../UI/TextTheme";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function ProfileReviewsTab({ navigation, route }) {
  const theme = useContext(themeContext);
  const token = useSelector(getToken);
  const currentUserPseudo = useSelector(getCurrentUserPseudo);
  const userPseudo = route.params.user || "";
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length;
  let nbReviews;
  switch (reviews.length) {
    case 0:
      nbReviews = " (pas encore d'évaluation)";
      break;
    case 1:
      nbReviews = " (1 évaluation)";
      break;
    default:
      nbReviews = ` (${reviews.length} évaluations)`;
      break;
  }

  const refreshHandler = useCallback(() => {
    setRefresh(true);
    wait(1500).then(() => setRefresh(false));
  }, []);

  useEffect(() => {
    getAllReviewsByUser(userPseudo, token).then((value) => {
      if (value !== []) {
        setReviews(value);
      }
    });
  }, [refresh]);

  function renderItem(data) {
    return (
      <View style={[styles.reviewTile, { backgroundColor: theme.colors.tile }]}>
        <View style={styles.row}>
          <Pressable
            onPress={() => {
              if (currentUserPseudo === data.item.author) {
                navigation.navigate("BottomTab");
              } else {
                navigation.push("OtherProfile", {
                  userPseudo: data.item.author,
                });
              }
            }}
          >
            <TextTheme>{`@${data.item.author}`}</TextTheme>
          </Pressable>
          <TextTheme style={styles.date}>{new Date(data.item.date).toLocaleDateString()}</TextTheme>
        </View>
        <StarRating grade={data.item.score} />
        <TextTheme>{data.item.comment}</TextTheme>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.overview}>
        <Ionicons name="star" size={20} color={Colors.primary500} />
        <TextTheme style={styles.average}>{` ${parseFloat(averageRating.toFixed(1))}`}</TextTheme>
        <TextTheme>{nbReviews}</TextTheme>
      </View>
      <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        style={styles.list}
        refreshing={refresh}
        onRefresh={refreshHandler}
        ListFooterComponent={() => <View />}
        ListFooterComponentStyle={{ height: 10 }}
      />
    </View>
  );
}

export default ProfileReviewsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewTile: {
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 8,
  },
  average: {
    fontWeight: "bold",
    color: Colors.primary500,
  },
  overview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomColor: Colors.gray400,
    borderBottomWidth: 1,
  },
  list: {
    flex: 1,
    paddingVertical: 5,
    paddingBottom: 50,
    marginBottom: 42,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 13,
  },
});
