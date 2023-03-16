import { Text, View, Pressable, StyleSheet } from "react-native";
import { useEffect } from "react";
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

// Mes réservations
function UserBookingTile({
  title,
  author,
  availability,
  booking,
  content,
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
  const [user, setUser] = useState(null);
  const [bookingObj, setBookingObj] = useState(null);

  useEffect(() => {
    getUser(author, token).then((value) => {
      setUser(value);
    });
  }, []);
  useEffect(() => {
    getBooking(booking, token).then((value) => {
      setBookingObj(value);
    });
  }, [refresh]);

  if (user === null || bookingObj === null) {
    return <Skeleton style={styles.skeleton} startColor={theme.colors.tile} />;
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.tile }]}>
      <Text style={styles.title}>{title}</Text>
      <VStack space={3}>
        <Pressable
          style={({ pressed }) => pressed && styles.pressed}
          onPress={() => {
            navigation.push("OtherProfile", { userPseudo: author });
          }}
        >
          <AvatarTile name={user?.name} firstname={user?.firstname} inline />
        </Pressable>

        <VStack space={4}>
          <VStack>
            <Text style={[styles.subtitle, { color: theme.colors.primary }]}>Description</Text>
            <TextTheme>{content}</TextTheme>
          </VStack>
          <VStack>
            <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
              Date de prestation
            </Text>
            <TextTheme>
              {new Date(servicedate).toLocaleDateString()} ({availability})
            </TextTheme>
          </VStack>
        </VStack>
      </VStack>

      <View style={styles.separator} />

      <VStack space={4}>
        <VStack>
          <Text style={[styles.subtitle, { color: Colors.accent500 }]}>Réservation</Text>
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
        <VStack>
          <Text style={[styles.subtitle, { color: Colors.accent500 }]}>Adresse</Text>
          {bookingObj.state !== "En attente d'approbation" ? (
            <>
              <TextTheme>
                {streetname} {streetnumber}
              </TextTheme>
              <TextTheme>
                {zipcodelocation} {citylocation}
              </TextTheme>
            </>
          ) : (
            <TextTheme>{citylocation} (adresse précise indisponible)</TextTheme>
          )}
        </VStack>
        {bookingObj.state === "Cloturé" && (
          <Button
            type="primary"
            onPress={() => {
              navigation.navigate("Review", {
                booking,
                author: bookingObj.user,
                recipient: author,
                token,
                prevScreen: "MyReservationsTab",
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

export default UserBookingTile;

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
});
