import { Pressable, Text, View, StyleSheet } from "react-native";
import { useEffect, useState, useContext, useCallback } from "react";
import themeContext from "../store/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import AdList from "../components/Ads/AdList";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import LocationSelect from "./LocationSelect";
import { getAdsByCity } from "../utils/api";
import { Colors } from "../utils/colors";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentUser,
  getCurrentUserLocation,
  getToken,
} from "../store/redux/selectors";
import { logout } from "../store/redux/actions/auth";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function HomeScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const theme = useContext(themeContext);
  const token = useSelector(getToken);
  const currentUser = useSelector(getCurrentUser);
  const currentUserLocation = useSelector(getCurrentUserLocation);
  const [location, setLocation] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [ads, setAds] = useState(null);

  useEffect(() => {
    setLocation(currentUserLocation);
  }, [currentUserLocation]);

  useEffect(() => {
    console.log("After render");
    if (location !== null) {
      getAdsByCity(location, token).then((response) => {
        if (response !== "jwt expired") {
          if (response !== []) {
            const filteredAds = response.filter((ad) => {
              return (
                ad.author !== currentUser.pseudo && new Date(ad.servicedate) >= new Date()
              );
            });
            setAds(filteredAds);
          }
        } else {
          Alert.alert(
            "Session expirée",
            "La session a expiré, veuillez-vous reconnecter.",
            [{ text: "OK", onPress: () => dispatch(logout()) }]
          );
        }
      });
    }
  }, [location, refresh]);

  console.log("Before render");

  function locationChangeHandler(value) {
    setLocation(value);
  }

  const refreshHandler = useCallback(() => {
    setRefresh(true);
    wait(1500).then(() => setRefresh(false));
  }, []);

  if (!location || ads === null) {
    return <LoadingSpinner />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.helloMsg}>Bonjour, {currentUser.firstname} !</Text>
      <Pressable onPress={() => navigation.navigate("Search")}>
        <View style={[styles.searchButton, { backgroundColor: theme.colors.tile }]}>
          <Ionicons name="search" size={24} color={Colors.gray400} />
          <Text style={styles.searchText}>Rechercher</Text>
        </View>
      </Pressable>
      <LocationSelect onLocationChange={locationChangeHandler} location={location} />
      <AdList data={ads} refreshing={refresh} onRefresh={refreshHandler} />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingTop: 10,
    flex: 1,
  },
  helloMsg: {
    color: Colors.accent500,
    marginLeft: 10,
    marginTop: 5,
    fontWeight: "bold",
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 7,
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: Colors.gray100,
    borderRadius: 5,
  },
  searchText: {
    color: Colors.gray500,
    marginLeft: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationBtn: {
    paddingHorizontal: 7,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  locationText: {
    color: Colors.gray400,
    marginLeft: 10,
    marginRight: 5,
  },
});
