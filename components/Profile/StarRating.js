import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../utils/colors";

function StarRating({ grade }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: grade }, (x, i) => {
        return (
          <Ionicons name="star" size={20} color={Colors.primary500} key={i} />
        );
      })}

      {Array.from({ length: 5 - grade }, (x, i) => {
        return (
          <Ionicons
            name={"star-outline"}
            size={20}
            color={Colors.primary500}
            key={i}
          />
        );
      })}
    </View>
  );
}

export default StarRating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
});
