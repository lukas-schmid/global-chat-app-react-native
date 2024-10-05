import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useLocalSearchParams } from "expo-router";
import { db } from "../firebaseConfig";
import { Button } from "@/components/Button";
import { Message } from "@/types/message";
import { MessageContainer } from "@/components/MessageContainer";
import { Colors } from "@/constants/Colors";

const MESSAGE_LIMIT = 25;

const ChatScreen = () => {
  const flatListRef = useRef<FlatList>(null);
  const { displayName } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastVisibleMessage, setLastVisibleMessage] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch initial messages and set up listener for real-time updates
  useEffect(() => {
    const messagesRef = collection(db, "lukas-global-chat-app");
    const q = query(
      messagesRef,
      orderBy("timestamp", "desc"),
      limit(MESSAGE_LIMIT),
    );

    const subscribe = onSnapshot(q, (snapshot) => {
      const messagesList: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName,
        message: doc.data().message,
        timestamp: doc.data().timestamp.toDate(),
      }));

      setMessages(messagesList);
      if (snapshot.docs.length > 0) {
        setLastVisibleMessage(snapshot.docs[snapshot.docs.length - 1]);
      }
    });
    fetchOlderMessages();

    return () => subscribe();
  }, []);

  // fetch next 10 messages
  const fetchOlderMessages = () => {
    const messagesRef = collection(db, "lukas-global-chat-app");
    const next = query(
      messagesRef,
      orderBy("timestamp", "desc"),
      startAfter(lastVisibleMessage),
      limit(MESSAGE_LIMIT),
    );

    getDocs(next).then((snapshot) => {
      const messagesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        displayName: doc.data().displayName,
        message: doc.data().message,
        timestamp: doc.data().timestamp.toDate(),
      }));

      const olderMessages = messagesList;
      setMessages((prevMessages) => [...prevMessages, ...olderMessages]);

      if (snapshot.docs.length > 0) {
        setLastVisibleMessage(snapshot.docs[snapshot.docs.length - 1]);
      }
    });
  };

  // Send a message
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
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      } catch (error) {
        console.error("Error sending message: ", error);
      } finally {
        setSendingMessage(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={60}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <MessageContainer item={item} />}
          keyExtractor={(item) => item.id}
          onEndReached={fetchOlderMessages}
          inverted
          style={styles.messagesList}
        />

        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            placeholder="Type a message..."
            onChangeText={setNewMessage}
            multiline={true}
            blurOnSubmit={false}
            editable={!sendingMessage}
          />
          <Button
            onPress={handleSendMessage}
            disabled={sendingMessage}
            style={styles.customButton}
          >
            {sendingMessage ? <ActivityIndicator color="white" /> : "Send"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.chatBackground,
  },
  messagesList: {
    paddingHorizontal: 15,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    height: 40,
    maxHeight: 120,
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

export default ChatScreen;
