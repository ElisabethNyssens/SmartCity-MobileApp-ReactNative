import { KeyboardAvoidingView, Platform } from "react-native";
import AdForm from "../components/Ads/AdForm";

function PublishScreen() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <AdForm />
    </KeyboardAvoidingView>
  );
}

export default PublishScreen;
