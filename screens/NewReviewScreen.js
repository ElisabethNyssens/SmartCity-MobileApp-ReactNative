import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../utils/colors";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import TextTheme from "../components/UI/TextTheme";
import { HStack, VStack } from "native-base";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { addReview } from "../utils/api";
import { getCurrentUserPseudo } from "../store/redux/selectors";
import { useSelector } from "react-redux";

function NewReviewScreen({ route, navigation }) {
  const { booking, recipient, token } = route.params;
  const author = useSelector(getCurrentUserPseudo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState({
    value: "",
    isValid: true,
  });

  function commentChangeHandler(val) {
    setComment({ value: val, isValid: true });
  }

  async function submitReviewHandler() {
    const commentIsValid = comment.value.trim().length >= 3;

    if (!commentIsValid) {
      setComment((currentComment) => {
        return { value: currentComment.value, isValid: commentIsValid };
      });
      return;
    }

    setIsSubmitting(true);
    await addReview(score, comment.value, booking, author, recipient, token);
    navigation.navigate({
      name: route.params.prevScreen,
      params: { refresh: true },
      refreshCounter: Math.random(),
      merge: true,
    });
  }

  if (isSubmitting) {
    return <LoadingSpinner message="Publication de l'évaluation…" />;
  }

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView>
        <VStack space={3}>
          <VStack m={1}>
            <TextTheme style={styles.title}>Tout s'est bien passé ?</TextTheme>
            <HStack style={styles.stars} space={2}>
              {Array.from({ length: 5 }, (x, i) => {
                return (
                  <TouchableOpacity onPress={() => setScore(i + 1)} key={i}>
                    <Ionicons
                      name={score > i ? "star" : "star-outline"}
                      size={35}
                      color={Colors.primary500}
                    />
                  </TouchableOpacity>
                );
              })}
            </HStack>
          </VStack>
          <Input
            label="Racontez votre expérience"
            textInputConfig={{
              onChangeText: commentChangeHandler,
              value: comment.value,
              multiline: true,
              editable: true,
              maxLength: 200,
            }}
            errorMsg={comment.isValid ? null : " "}
          />
          <Button type="primary" onPress={submitReviewHandler}>
            Publier
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default NewReviewScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  stars: {},
});
