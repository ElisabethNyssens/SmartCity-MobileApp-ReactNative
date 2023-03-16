import { FlatList, StyleSheet } from "react-native";
import TextTheme from "../UI/TextTheme";
import AdTile from "./AdTile";
import LoadingSpinner from "../UI/LoadingSpinner";

function AdList({ data, fetchingData, refreshing, onRefresh }) {
  const renderItem = ({ item }) => {
    return <AdTile data={item} />;
  };

  if (fetchingData) {
    return <LoadingSpinner message="Récupération des annonces…" />;
  }
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={() => (
        <TextTheme style={styles.fallbackText}>Aucune annonce pour le moment</TextTheme>
      )}
      refreshing={refreshing}
      onRefresh={() => onRefresh()}
    />
  );
}

export default AdList;

const styles = StyleSheet.create({
  fallbackText: {
    textAlign: "center",
    padding: 20,
  },
});
