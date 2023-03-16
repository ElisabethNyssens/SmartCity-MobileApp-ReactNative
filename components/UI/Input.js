import { Text, TextInput, View, StyleSheet, Pressable } from "react-native";
import { useContext, useState } from "react";
import { Colors } from "../../utils/colors";
import { Ionicons } from "@expo/vector-icons";
import themeContext from "../../store/context/ThemeContext";

function Input({
  label,
  style,
  textInputConfig,
  errorMsg,
  isPassword,
  isSearchBar,
  searchHandler,
}) {
  const [hiddenPassword, setHiddenPassword] = useState(isPassword);
  const theme = useContext(themeContext);
  let inputStyles = [styles.input];

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  if (textInputConfig && textInputConfig.editable === false) {
    inputStyles.push(styles.enabled);
  }

  function toggleHiddenPassword() {
    setHiddenPassword((prevState) => !prevState);
  }

  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      <View>
        <TextInput
          style={[inputStyles, errorMsg && styles.invalidInput, { color: theme.colors.text }]}
          {...textInputConfig}
          secureTextEntry={hiddenPassword}
          placeholderTextColor={Colors.gray400}
        />
        {isPassword && (
          <Pressable style={[styles.floatingBtn, styles.eye]} onPress={toggleHiddenPassword}>
            <Ionicons
              name={hiddenPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color={Colors.gray400}
            />
          </Pressable>
        )}
        {isSearchBar && (
          <Pressable
            style={[styles.floatingBtn, styles.search, { backgroundColor: theme.colors.primary }]}
            onPress={searchHandler}
          >
            <Ionicons name="search" size={24} color="white" />
          </Pressable>
        )}
      </View>
      {errorMsg && errorMsg !== " " && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 16,
    borderColor: Colors.gray400,
  },
  invalidInput: {
    borderColor: Colors.error300,
    borderWidth: 1.5,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 16,
    maxHeight: 140,
  },
  errorText: {
    color: Colors.error500,
    marginTop: 5,
    fontSize: 13,
  },
  floatingBtn: {
    position: "absolute",
    justifyContent: "center",
    height: "100%",
  },
  eye: {
    right: 10,
  },
  enabled: {
    opacity: 0.5,
  },
  search: {
    right: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomEndRadius: 6,
    borderTopEndRadius: 6,
  },
});
