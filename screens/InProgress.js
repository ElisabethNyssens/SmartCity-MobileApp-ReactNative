import { RefreshControl, ScrollView, View, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getCurrentUserPseudo, getToken } from "../store/redux/selectors";
import { useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { getAllCurrentAdsForUser, getAllCurrentAdsFromUser } from "../utils/api";
import TextTheme from "../components/UI/TextTheme";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { Colors } from "../utils/colors";
import UserBookingTile from "../components/InProgress/UserBookingTile";
import BookingRequestTile from "../components/InProgress/BookingRequestTile";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function MyReservations({ route }) {
  const token = useSelector(getToken);
  const currentUserPseudo = useSelector(getCurrentUserPseudo);
  const [userReservations, setUserReservations] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getAllCurrentAdsForUser(currentUserPseudo, token).then((value) => {
      setUserReservations(value);
    });
  }, [refresh]);

  useEffect(() => {
    route.params?.refresh && refreshHandler();
  }, [route.params?.refresh]);

  const refreshHandler = useCallback(() => {
    setRefresh(true);
    wait(1500).then(() => setRefresh(false));
  }, []);

  if (userReservations === null) {
    return <LoadingSpinner />;
  }
  return (
    <ScrollView
      style={styles.list}
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshHandler} />}
    >
      {userReservations &&
        userReservations.map((reservation) => (
          <UserBookingTile {...reservation} refresh={refresh} key={reservation.id} />
        ))}
      {userReservations.length === 0 && (
        <TextTheme style={styles.fallbackText}>Aucune réservation pour le moment</TextTheme>
      )}
      <View style={{ height: 15 }} />
    </ScrollView>
  );
}

function MyAds({ route }) {
  const token = useSelector(getToken);
  const currentUserPseudo = useSelector(getCurrentUserPseudo);
  const [userBookedAds, setUserBookedAds] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getAllCurrentAdsFromUser(currentUserPseudo, token).then((value) => {
      setUserBookedAds(value);
    });
  }, [refresh]);

  useEffect(() => {
    route.params?.refresh && refreshHandler();
  }, [route.params?.refresh, route.params?.refreshCounter]);

  const refreshHandler = useCallback(() => {
    setRefresh(true);
    wait(1500).then(() => setRefresh(false));
  }, []);

  if (userBookedAds === null) {
    return <LoadingSpinner />;
  }
  return (
    <ScrollView
      style={styles.list}
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshHandler} />}
    >
      {userBookedAds &&
        userBookedAds.map((ad) => <BookingRequestTile {...ad} refresh={refresh} key={ad.id} />)}
      {userBookedAds.length === 0 && (
        <TextTheme style={styles.fallbackText}>Aucune réservation pour le moment</TextTheme>
      )}
      <View style={{ height: 15 }} />
    </ScrollView>
  );
}

function InProgressScreen() {
  const Tab = createMaterialTopTabNavigator();

  return (
    <>
      <Tab.Navigator
        style={styles.nav}
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, textTransform: "capitalize" },
        }}
      >
        <Tab.Screen
          name="MyReservationsTab"
          component={MyReservations}
          options={{ title: "Mes réservations" }}
        />
        <Tab.Screen name="MyAdsTab" component={MyAds} options={{ title: "Mes annonces" }} />
      </Tab.Navigator>
    </>
  );
}

export default InProgressScreen;

const styles = StyleSheet.create({
  nav: {
    flex: 1,
  },
  list: {
    overflow: "visible",
    paddingTop: 10,
  },
  fallbackText: {
    textAlign: "center",
    padding: 20,
  },
  bookingTile: {
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
  },
  title: {
    color: Colors.primary500,
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 3,
  },
});
