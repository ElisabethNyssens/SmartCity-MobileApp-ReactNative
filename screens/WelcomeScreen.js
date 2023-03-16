import { Image, View, StyleSheet, Text } from "react-native";
import Button from "../components/UI/Button";
import { Colors } from "../utils/colors";

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/splash.png")}
        resizeMode="contain"
      />
      <Text style={styles.text}>
        Aidez les personnes de votre région et gagnez des perles!
      </Text>

      <View style={styles.rowButtons}>
        <Button type="primary" onPress={() => navigation.navigate("Login")}>
          Connexion
        </Button>
        <Button type="secondary" onPress={() => navigation.navigate("Signin")}>
          Inscription
        </Button>
      </View>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary100,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.primary900,
    textAlign: "center",
    paddingHorizontal: 50,
    paddingVertical: 10,
    fontSize: 18,
  },
  image: {
    width: "130%",
    height: 150,
    marginTop: 20,
    objectPosition: "center",
  },
  rowButtons: {
    justifyContent: "space-around",
    paddingTop: 60,
    paddingHorizontal: 30,
  },
});
