import { View, StyleSheet } from "react-native";
import { Avatar } from "native-base";
import TextTheme from "./TextTheme";
import { Colors } from "../../utils/colors";

function AvatarTile({ name, firstname, pseudo, inline }) {
  return (
    <View style={styles.row}>
      <Avatar
        style={styles.avatar}
        bgColor={Colors.accent400}
        size={inline ? "xs" : "sm"}
      >
        {`${firstname?.slice(0, 1)}${name?.slice(0, 1)}`}
      </Avatar>
      <View>
        <TextTheme>
          {firstname} {name}
        </TextTheme>
        {!inline && <TextTheme style={styles.pseudo}>@{pseudo}</TextTheme>}
      </View>
    </View>
  );
}

export default AvatarTile;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 10,
  },
  pseudo: {
    fontSize: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
