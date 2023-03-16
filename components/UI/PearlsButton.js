import { Image, View, Pressable, Text, StyleSheet } from "react-native";
import { Colors } from "../../utils/colors";
import { useNavigation } from "@react-navigation/native";

function PearlsButton({ quantity }) {
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.settingsBtn}
      onPress={() => navigation.navigate("Pearls")}
    >
      <View style={styles.button}>
        <Text style={styles.text}>{quantity}</Text>
        <Image
          style={styles.icon}
          source={require("../../assets/pearls-icon.png")}
        />
      </View>
    </Pressable>
  );
}

export default PearlsButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary900,
    marginLeft: 10,
  },
  text: {
    color: "#ffffff",
  },
  icon: {
    width: 22,
    height: 20,
    marginLeft: 5,
  },
});
