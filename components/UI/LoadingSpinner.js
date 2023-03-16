import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../utils/colors";

function LoadingSpinner({ message, size }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size ?? "large"} color={Colors.primary500} />
      {message && <Text style={[styles.message, { color: Colors.primary500 }]}>{message}</Text>}
    </View>
  );
}

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
});
