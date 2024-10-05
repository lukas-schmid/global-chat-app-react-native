import { Colors } from "@/constants/Colors";
import { Message } from "@/types/message";
import { View, Text, StyleSheet } from "react-native";

interface MessageContainerProps {
  item: Message;
}

export const MessageContainer = ({ item }: MessageContainerProps) => {
  return (
    <View key={item.id} style={styles.messageContainer}>
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <Text style={styles.messageAuthor}>{item.displayName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 12,
    alignItems: "flex-start",
  },
  messageBubble: {
    backgroundColor: Colors.grayLight,
    padding: 10,
    borderRadius: 16,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: Colors.grayDark,
  },
  messageAuthor: {
    fontWeight: "600",
    marginBottom: 4,
    marginLeft: 4,
    color: Colors.tertiary,
  },
});
