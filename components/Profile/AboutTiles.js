import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { getUser, nbServicesReceived, nbServicesRendered } from "../../utils/api";
import { useSelector } from "react-redux";
import { getToken } from "../../store/redux/selectors";

import AboutTile from "./AboutTile";

function AboutTiles({ userPseudo, refresh }) {
  const token = useSelector(getToken);
  const [nbServReceived, setNbServReceived] = useState(null);
  const [nbServRendered, setNbServRendered] = useState(null);
  const [nbPearls, setNbPearls] = useState(null);

  useEffect(() => {
    nbServicesReceived(userPseudo, token).then((value) => {
      setNbServReceived(value);
    });
    nbServicesRendered(userPseudo, token).then((value) => {
      setNbServRendered(value);
    });
    getUser(userPseudo, token).then((value) => {
      setNbPearls(value.nbpearls);
    });
  }, [refresh]);

  return (
    <View style={styles.tilesContainer}>
      <AboutTile counter={nbPearls} title={nbPearls > 1 ? "perles" : "perle"} />
      <AboutTile counter={nbServRendered} title="services rendus" />
      <AboutTile counter={nbServReceived} title="services reçus" />
    </View>
  );
}

export default AboutTiles;

const styles = StyleSheet.create({
  tilesContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
});
