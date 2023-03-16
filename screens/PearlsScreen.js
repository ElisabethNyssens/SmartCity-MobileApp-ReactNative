import { View, Text, StyleSheet } from "react-native";
import { HStack } from "native-base";
import { useContext } from "react";
import themeContext from "../store/context/ThemeContext";
import { Colors } from "../utils/colors";
import TextTheme from "../components/UI/TextTheme";

function PearlsScreen() {
  const theme = useContext(themeContext);
  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.colors.tile }]}>
        <View style={styles.cardItem}>
          <Text style={styles.number}>1 </Text>
          <TextTheme>service</TextTheme>
          <TextTheme>rendu</TextTheme>
        </View>
        <View style={styles.equal}>
          <TextTheme style={{ fontSize: 20 }}> = </TextTheme>
        </View>
        <View style={styles.cardItem}>
          <Text style={styles.number}>1 </Text>
          <TextTheme>perle</TextTheme>
        </View>
      </View>
      <TextTheme style={{ fontSize: 13 }}>
        Dès que vous rendez un service à quelqu'un et que ce service a été
        validé par cette personne, une perle est automatiquement ajoutée à votre
        cagnote. Toutefois, si vous recevez de l'aide 3 fois d'affilé sans avoir
        rendu de service en échange, vous perdrez une perle.
      </TextTheme>
    </View>
  );
}

export default PearlsScreen;

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  number: {
    color: Colors.accent500,
    fontSize: 24,
    fontWeight: "bold",
  },
  cardItem: {
    alignItems: "center",
    flex: 1,
  },
  equal: {
    justifyContent: "center",
  },
});
