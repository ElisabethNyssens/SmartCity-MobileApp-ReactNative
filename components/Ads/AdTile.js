import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Colors } from "../../utils/colors";
import { useContext, useEffect, useState } from "react";
import themeContext from "../../store/context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../../utils/api";
import AdInfo from "./AdInfo";
import { getToken } from "../../store/redux/selectors";
import { useSelector } from "react-redux";

function AdTile({ data, searchResult }) {
  const token = useSelector(getToken);
  const theme = useContext(themeContext);
  const navigation = useNavigation();
  const { author, title, citylocation } = data;
  const date = new Date(data.creationdate);
  const [adLocation, setAdLocation] = useState("Ville");
  const [authorInfo, setAuthorInfo] = useState();

  useEffect(() => {
    getUser(author, token).then((value) => {
      setAuthorInfo(value);
      setAdLocation(citylocation || value.citylocation);
    });
  }, []);

  return (
    <Pressable
      onPress={() =>
        searchResult
          ? navigation.replace("AdDetail", {
              data,
            })
          : navigation.push("AdDetail", {
              data,
            })
      }
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.tile }]}>
        <View style={styles.textContainer}>
          <View>
            <Text style={[styles.SearchText, { color: theme.colors.primary }]}>Recherche</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <AdInfo date={date} location={adLocation} />
        </View>
        <View style={styles.imgContainer}>
          <Image source={require("../../assets/help.jpg")} style={styles.img} />
        </View>
      </View>
    </Pressable>
  );
}

export default AdTile;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 10,
    maxHeight: 150,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  textContainer: {
    padding: 15,
    justifyContent: "space-between",
  },
  imgContainer: {
    overflow: "hidden",
  },
  img: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: "100%",
    width: 120,
  },
  SearchText: {
    fontSize: 13,
  },
  title: {
    color: Colors.primary500,
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  icon: {
    marginRight: 5,
  },
});
