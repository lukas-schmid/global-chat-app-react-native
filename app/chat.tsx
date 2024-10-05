import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Message } from "@/types/message";
import { MessageContainer } from "@/components/MessageContainer";
import { Colors } from "@/constants/Colors";
import { Footer } from "@/components/Footer";

const MESSAGE_LIMIT = 25;

const ChatScreen = () => {
  const flatListRef = useRef<FlatList<Message>>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastVisibleMessage, setLastVisibleMessage] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

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
        <Footer flatListRef={flatListRef} />
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
});

export default ChatScreen;
