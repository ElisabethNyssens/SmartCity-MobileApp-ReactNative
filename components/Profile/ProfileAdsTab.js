import { ScrollView, StyleSheet, Alert, RefreshControl } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextTheme from "../UI/TextTheme";
import { getToken } from "../../store/redux/selectors";
import { logout } from "../../store/redux/actions/auth";
import { getAdsByAuthor } from "../../utils/api";
import AdList from "../Ads/AdList";
import AdTile from "../Ads/AdTile";
import LoadingSpinner from "../UI/LoadingSpinner";
import { View } from "native-base";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

function ProfileAdsTab({ route }) {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [ads, setAds] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const user = route.params.user;

  useEffect(() => {
    getAdsByAuthor(user, token).then((value) => {
      if (value === "jwt expired") {
        Alert.alert("Session expirée", "La session a expiré, veuillez-vous reconnecter.", [
          { text: "OK", onPress: () => dispatch(logout()) },
        ]);
      } else {
        setAds(value);
        setFetchingData(false);
      }
    });
  }, [refresh]);

  useEffect(() => {
    route.params?.refresh && refreshHandler();
  }, [route.params?.refresh]);

  const refreshHandler = useCallback(() => {
    setRefresh(true);
    wait(1500).then(() => setRefresh(false));
  }, []);

  if (ads === null) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshHandler} />}
    >
      {/* <AdList data={ads} fetchingData={fetchingData} /> */}
      {ads && ads.map((ad) => <AdTile data={ad} key={ad.id} />)}
      {ads == "" && (
        <TextTheme style={styles.fallbackText}>Aucune annonce pour le moment</TextTheme>
      )}
      <View style={styles.marginBlock} />
    </ScrollView>
  );
}

export default ProfileAdsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallbackText: {
    textAlign: "center",
    padding: 20,
  },
  marginBlock: {
    height: 10,
  },
});
