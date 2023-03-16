import { View, Image, StyleSheet, Text, Pressable, Alert, ScrollView } from "react-native";
import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton, VStack } from "native-base";
import { getCurrentUserPseudo, getToken } from "../store/redux/selectors";
import { getUser, deleteAd } from "../utils/api";
import AvatarTile from "../components/UI/AvatarTile";
import Button from "../components/UI/Button";
import { Colors } from "../utils/colors";
import themeContext from "../store/context/ThemeContext";
import TextTheme from "../components/UI/TextTheme";
import AdInfo from "../components/Ads/AdInfo";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { requestBooking } from "../utils/api";

function AdDetailScreen({ navigation, route }) {
  const currentUserPseudo = useSelector(getCurrentUserPseudo);
  const token = useSelector(getToken);
  const theme = useContext(themeContext);
  const { id, title, content, citylocation, availability, author, booking } = route.params.data;
  const creationDate = new Date(route.params.data.creationdate);
  const serviceDate = new Date(route.params.data.servicedate);
  const [user, setUser] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title,
    });
  }, [navigation]);

  useEffect(() => {
    getUser(author, token).then((value) => {
      setUser(value);
    });
  }, []);

  useLayoutEffect(() => {
    if (currentUserPseudo === user?.pseudo) {
      navigation.setOptions({
        headerRight: () => {
          return (
            <Pressable style={styles.settingsBtn} onPress={handleDeleteAd}>
              <Ionicons name={"trash-outline"} size={24} color="white" />
            </Pressable>
          );
        },
      });
    }
  }, [navigation, currentUserPseudo, user]);

  function handleDeleteAd() {
    Alert.alert("Attention", "Êtes-vous sûr de vouloir supprimer cette  annonce ?", [
      {
        text: "Oui",
        onPress: async () => {
          try {
            setIsLoading(true);
            await deleteAd(id, token);
            Alert.alert("Succès", "L'annonce a bien été supprimée !");
            navigation.goBack();
          } catch (e) {
            setIsLoading(false);
            Alert.alert("Erreur", "Impossible de supprimer l'annonce…");
          }
        },
        style: "destructive",
      },
      {
        text: "Non",
        style: "default",
      },
    ]);
  }

  async function handleBooking() {
    setIsLoading(true);
    try {
      await requestBooking(id, currentUserPseudo, token);
      setIsBooked(true);
      Alert.alert(
        "Réservation",
        `Vous avez bien réservé. Attendez maintenant que @${author} approuve.`
      );
    } catch (e) {
      Alert.alert("Erreur", "Impossible de réserver...");
    }
    setIsLoading(false);
  }

  if (!user) {
    return (
      <VStack space="5">
        <Skeleton h="40" startColor={theme.colors.tile} endColor="transparent" />
        <Skeleton.Text px="4" startColor={theme.colors.tile} endColor="transparent" />
      </VStack>
    );
  }
  if (isLoading) {
    return <LoadingSpinner message="Réservation en cours…" />;
  }
  return (
    <>
      <ScrollView>
        <Image style={styles.image} source={require("../assets/help.jpg")} />
        <View style={styles.container}>
          <Text style={{ color: theme.colors.primary }}>Recherche</Text>
          <Text style={styles.title}>{title}</Text>
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={() => {
              if (currentUserPseudo === user?.pseudo) {
                navigation.navigate("BottomTab", { screen: "Profil" });
              } else {
                navigation.push("OtherProfile", {
                  user,
                });
              }
            }}
          >
            <AvatarTile name={user?.name} firstname={user?.firstname} inline />
          </Pressable>
        </View>
        <View style={styles.separator} />
        <View style={styles.container}>
          <AdInfo date={creationDate} location={citylocation} />
        </View>
        <View style={styles.separator} />
        <View style={styles.container}>
          <Text style={[styles.subtitle]}>Date</Text>
          <TextTheme style={styles.text}>
            {serviceDate.toLocaleDateString()} ({availability})
          </TextTheme>
          <Text style={[styles.subtitle]}>Description</Text>
          <TextTheme style={styles.text}>{content}</TextTheme>
        </View>
      </ScrollView>
      <View style={styles.separator} />
      {currentUserPseudo !== user?.pseudo && (
        <Button type="primary" onPress={handleBooking} disabled={booking || isBooked}>
          {isBooked ? "Réservé" : "Réserver"}
        </Button>
      )}
    </>
  );
}

export default AdDetailScreen;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 170,
    zIndex: 1,
  },
  container: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  title: {
    color: Colors.primary500,
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 5,
  },
  subtitle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 13,
    color: Colors.accent500,
  },
  text: {
    marginTop: 2,
    marginBottom: 15,
    fontSize: 16,
  },
  separator: {
    backgroundColor: Colors.gray400,
    opacity: 0.5,
    height: 1,
    width: "100%",
  },
  pressed: {
    opacity: 0.6,
  },
});
