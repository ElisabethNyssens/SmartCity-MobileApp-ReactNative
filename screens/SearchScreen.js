import {
  Text,
  FlatList,
  View,
  StyleSheet,
  Pressable,
  Keyboard,
} from "react-native";
import { useState } from "react";
import Input from "../components/UI/Input";
import { searchUser, searchAd } from "../utils/api";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getToken, getCurrentUserPseudo } from "../store/redux/selectors";
import { useSelector } from "react-redux";
import AvatarTile from "../components/UI/AvatarTile";
import AdTile from "../components/Ads/AdTile";
import { Colors } from "../utils/colors";
import SearchTab from "../components/Home/SearchTab";

function AdsSearch({ route }) {
  const [fetchingData, setFetchingData] = useState(false);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  async function searchHandler() {
    setInput("");
    Keyboard.dismiss();
    setFetchingData(true);
    const response = await searchAd(input.trim(), route.params.token);
    setSearchResult(response);
    setFetchingData(false);
  }

  function inputChangeHandler(input) {
    setInput(input);
  }

  const renderItem = ({ item }) => {
    return <AdTile data={item} searchResult />;
  };

  return (
    <SearchTab
      inputChangeHandler={inputChangeHandler}
      searchHandler={searchHandler}
      fetchingData={fetchingData}
      data={searchResult}
      renderItem={renderItem}
      inputValue={input}
    />
  );
}

function UsersSearch({ navigation, route }) {
  const currentUserPseudo = useSelector(getCurrentUserPseudo);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);

  async function searchHandler() {
    setInput("");
    Keyboard.dismiss();
    setFetchingData(true);
    const response = await searchUser(input.trim(), route.params.token);
    setSearchResult(response);
    setFetchingData(false);
  }

  function inputChangeHandler(input) {
    setInput(input);
  }

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={({ pressed }) => [pressed && styles.pressed, styles.tile]}
        onPress={() => {
          if (currentUserPseudo === item.pseudo) {
            navigation.navigate("Profil");
          } else {
            navigation.replace("OtherProfile", {
              userPseudo: item.pseudo,
            });
          }
        }}
      >
        <AvatarTile
          pseudo={item.pseudo}
          name={item.name}
          firstname={item.firstname}
        />
      </Pressable>
    );
  };

  return (
    <SearchTab
      inputChangeHandler={inputChangeHandler}
      searchHandler={searchHandler}
      fetchingData={fetchingData}
      data={searchResult}
      renderItem={renderItem}
      inputValue={input}
    />
  );
}

function SearchScreen() {
  const Tab = createMaterialTopTabNavigator();
  const token = useSelector(getToken);

  return (
    <>
      <Tab.Navigator
        style={styles.nav}
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, textTransform: "capitalize" },
        }}
      >
        <Tab.Screen
          name="AdsSearchTab"
          component={AdsSearch}
          options={{ title: "Annonces" }}
          initialParams={{ token }}
        />
        <Tab.Screen
          name="UsersSearchTab"
          component={UsersSearch}
          options={{ title: "Utilisateurs" }}
          initialParams={{ token }}
        />
      </Tab.Navigator>
    </>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  nav: {
    flex: 1,
  },
  list: {
    // overflow: "visible",
    flex: 1,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.6,
  },
  tile: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
