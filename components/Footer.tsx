import {
  ActivityIndicator,
  TextInput,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { Button } from "./Button";
import { Colors } from "@/constants/Colors";
import { RefObject, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Message } from "@/types/message";

interface FooterProps {
  flatListRef: RefObject<FlatList<Message>>;
}

export const Footer = ({ flatListRef }: FooterProps) => {
  const { displayName } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);

  const handleSendMessage = async () => {
    if (newMessage.trim() && !sendingMessage) {
      setSendingMessage(true);
      const messagesRef = collection(db, "lukas-global-chat-app");

      try {
        await addDoc(messagesRef, {
          displayName,
          message: newMessage,
          timestamp: new Date(),
        });
        setNewMessage("");
        setInputHeight(40);
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      } catch (error) {
        console.error("Error sending message: ", error);
      } finally {
        setSendingMessage(false);
      }
    }
  };

  return (
    <View style={styles.footer}>
      <TextInput
        style={[styles.input, { height: inputHeight }]}
        value={newMessage}
        placeholder="Type a message..."
        onChangeText={setNewMessage}
        multiline={true}
        blurOnSubmit={false}
        editable={!sendingMessage}
        onContentSizeChange={(e) =>
          setInputHeight(Math.min(120, e.nativeEvent.contentSize.height))
        }
      />
      <Button
        onPress={handleSendMessage}
        disabled={sendingMessage}
        style={styles.customButton}
      >
        {sendingMessage ? <ActivityIndicator color={Colors.white} /> : "Send"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
    borderColor: Colors.grayLight,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: Colors.white,
  },
  customButton: {
    borderRadius: 20,
    minWidth: 80,
  },
});
