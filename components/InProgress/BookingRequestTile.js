import { Text, View, Pressable, Alert, StyleSheet } from "react-native";
import { useEffect, useReducer } from "react";
import TextTheme from "../UI/TextTheme";
import { HStack, Skeleton, VStack } from "native-base";
import { Colors } from "../../utils/colors";
import themeContext from "../../store/context/ThemeContext";
import { useContext, useState } from "react";
import { getToken } from "../../store/redux/selectors";
import { useSelector } from "react-redux";
import { getUser, getBooking } from "../../utils/api";
import AvatarTile from "../UI/AvatarTile";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../UI/Button";
import LoadingSpinner from "../UI/LoadingSpinner";
import { closeBooking, approveBooking, deleteBooking } from "../../utils/api";
import TextButton from "../UI/TextButton";

// Mes annonces
function BookingRequestTile({
  title,
  availability,
  booking,
  content,
  author,
  servicedate,
  streetname,
  streetnumber,
  citylocation,
  zipcodelocation,
  refresh,
}) {
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const token = useSelector(getToken);
  const [bookingObj, setBookingObj] = useState(null);
  const [user, setUser] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [refreshBooking, setRefreshBooking] = useState(false);

  useEffect(() => {
    getBooking(booking, token).then((value) => {
      setBookingObj(value);
    });
  }, [refresh, refreshBooking]);
  useEffect(() => {
    if (bookingObj !== null) {
      getUser(bookingObj.user, token).then((value) => {
        setUser(value);
      });
    }
  }, [bookingObj]);

  function refreshHandler() {
    setRefreshBooking((state) => !state);
  }

  function handleCloseBooking() {
    async function close() {
      try {
        setIsSubmiting(true);
        await closeBooking(booking, token);
        setIsSubmiting(false);
        refreshHandler();
      } catch (e) {
        Alert.alert("Erreur", "Impossible de clôturer la réservation...");
      }
    }

    Alert.alert(
      "Clôturer",
      `Confirmez-vous que @${user.pseudo} vous a aidé ? Si oui, iel recevra une perle.`,
      [
        {
          text: "Oui",
          onPress: async () => {
            await close();
          },
          style: "destructive",
        },
        {
          text: "Non",
          style: "default",
        },
      ]
    );
  }

  async function handleApproveBooking() {
    try {
      setIsSubmiting(true);
      await approveBooking(booking, token);
      refreshHandler();
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'accepter la réservation...");
    }
    setIsSubmiting(false);
  }

  // PROB
  async function handleDeclineBooking() {
    try {
      setIsSubmiting(true);
      await deleteBooking(booking, token);
      refreshHandler();
    } catch (e) {
      Alert.alert("Erreur", "Impossible de supprimer la réservation...");
    }
    setIsSubmiting(false);
  }

  if (user === null || bookingObj === null) {
    return <Skeleton style={styles.skeleton} startColor={theme.colors.tile} />;
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.tile }]}>
      <VStack space={2}>
        <Text style={styles.title}>{title}</Text>
        <VStack>
          <Text style={[styles.subtitle, { color: theme.colors.primary }]}>Description</Text>
          <TextTheme>{content}</TextTheme>
        </VStack>
        <VStack>
          <Text style={[styles.subtitle, { color: theme.colors.primary }]}>Date de prestation</Text>
          <TextTheme>
            {new Date(servicedate).toLocaleDateString()} ({availability})
          </TextTheme>
        </VStack>
        <VStack>
          <Text style={[styles.subtitle, { color: theme.colors.primary }]}>Adresse</Text>
          <TextTheme>
            {streetname} {streetnumber}
          </TextTheme>
          <TextTheme>
            {zipcodelocation} {citylocation}
          </TextTheme>
        </VStack>
      </VStack>

      <View style={styles.separator} />

      <VStack space={4}>
        <VStack space={2}>
          <VStack>
            <Text style={[styles.subtitle, { color: Colors.accent500 }]}>Réservation</Text>
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={() => {
                navigation.push("OtherProfile", { userPseudo: user.pseudo });
              }}
            >
              <AvatarTile name={user?.name} firstname={user?.firstname} inline />
            </Pressable>
            <TextTheme>Réservé le {new Date(bookingObj.date).toLocaleDateString()}</TextTheme>
          </VStack>
          <VStack>
            <Text style={[styles.subtitle, { color: Colors.accent500 }]}>Statut</Text>
            <HStack alignItems="center" space={1}>
              <Ionicons
                name={
                  bookingObj.state === "En attente d'approbation" ? "hourglass-outline" : "calendar"
                }
                size={18}
                color={theme.colors.text}
              />
              <TextTheme style={styles.statusText}>{bookingObj.state}</TextTheme>
            </HStack>
          </VStack>
        </VStack>

        <VStack>
          <Text style={[styles.subtitle, { color: Colors.accent500 }]}>Contact</Text>
          {bookingObj.state !== "En attente d'approbation" ? (
            <>
              <TextTheme>Email : {user.email}</TextTheme>
              <TextTheme>Téléphone : {user.phone}</TextTheme>
            </>
          ) : (
            <TextTheme>Indisponible</TextTheme>
          )}
        </VStack>

        {isSubmiting && <LoadingSpinner size="small" />}

        {!isSubmiting && bookingObj.state === "En cours" && (
          <Button type="primary" onPress={handleCloseBooking}>
            Clôturer
          </Button>
        )}
        {!isSubmiting && bookingObj.state === "En attente d'approbation" && (
          <HStack justifyContent="center">
            <Button style={styles.btn} type="secondary" onPress={handleDeclineBooking}>
              Refuser
            </Button>
            <Button style={styles.btn} type="primary" onPress={handleApproveBooking}>
              Accepter
            </Button>
          </HStack>
        )}
        {!isSubmiting && bookingObj.state === "Cloturé" && (
          <Button
            type="primary"
            onPress={() => {
              navigation.navigate("Review", {
                booking,
                author,
                recipient: bookingObj.user,
                token,
                prevScreen: "MyAdsTab",
              });
            }}
          >
            Laisser une évaluation
          </Button>
        )}
      </VStack>
    </View>
  );
}

export default BookingRequestTile;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
  },
  title: {
    color: Colors.primary500,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
  },
  subtitle: {
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 13,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 15,
  },
  skeleton: {
    marginTop: 10,
    paddingHorizontal: 10,
    height: 55,
    borderRadius: 8,
  },
  separator: {
    backgroundColor: Colors.gray400,
    opacity: 0.5,
    height: 1,
    width: "100%",
    marginVertical: 15,
  },
  pressed: {
    opacity: 0.6,
  },
  btn: {
    minWidth: 0,
  },
});
