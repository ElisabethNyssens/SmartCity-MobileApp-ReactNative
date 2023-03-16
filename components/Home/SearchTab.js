import { StyleSheet, FlatList, View, Text } from "react-native";
import Input from "../UI/Input";
import LoadingSpinner from "../UI/LoadingSpinner";

function SearchTab({
  inputChangeHandler,
  searchHandler,
  fetchingData,
  data,
  renderItem,
  inputValue,
}) {
  const fallBack = <Text style={styles.fallbackText}>Aucun résultat</Text>;

  return (
    <View style={styles.container}>
      <Input
        textInputConfig={{
          value: inputValue,
          placeholder: "Rechercher",
          onChangeText: inputChangeHandler,
          maxLength: 40,
        }}
        isSearchBar={true}
        searchHandler={searchHandler}
      />
      {fetchingData && <LoadingSpinner />}
      {!fetchingData && (
        <FlatList
          data={data}
          style={styles.list}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id || item?.pseudo}
          ListEmptyComponent={() => data && fallBack}
        />
      )}
    </View>
  );
}

export default SearchTab;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginTop: 5,
    flex: 1,
  },
  fallbackText: {
    textAlign: "center",
    padding: 20,
  },
});
