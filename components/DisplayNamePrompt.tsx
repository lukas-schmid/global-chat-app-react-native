import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  TextInput,
  Modal,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button } from "./Button";
import { Colors } from "@/constants/Colors";

interface DisplayNamePromptProps {
  isOpen: boolean;
  onClose(): void;
}

export const DisplayNamePrompt = ({
  isOpen,
  onClose,
}: DisplayNamePromptProps) => {
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  const handleJoinChat = () => {
    if (displayName.trim()) {
      router.push({
        pathname: "/chat",
        params: { displayName },
      });
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>Enter Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your Name"
              placeholderTextColor="#aaa"
              accessibilityLabel="Display Name Input"
            />
            <View style={styles.buttonContainer}>
              <Button onPress={handleJoinChat} disabled={!displayName}>
                Join Chat
              </Button>
              <Button variant="secondary" onPress={onClose}>
                Close
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: "80%",
  },
  modalHeader: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
  input: {
    borderColor: Colors.gray,
    borderWidth: 1,
    padding: 15,
    marginBottom: 25,
    width: "100%",
    borderRadius: 8,
  },
  buttonContainer: {
    gap: 20,
    alignItems: "center",
  },
});
