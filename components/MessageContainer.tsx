import { Colors } from "@/constants/Colors";
import { Message } from "@/types/message";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

interface MessageContainerProps {
  item: Message;
}

export const MessageContainer = ({ item }: MessageContainerProps) => {
  const { displayName } = useLocalSearchParams();
  const isMyMessage = item.displayName === displayName;

  return (
    <View
      key={item.id}
      style={[
        styles.messageContainer,
        { alignItems: isMyMessage ? "flex-end" : "flex-start" },
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          { backgroundColor: isMyMessage ? Colors.yellow : Colors.grayLight },
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <Text style={styles.messageAuthor}>
        {isMyMessage ? "Me" : item.displayName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 12,
  },
  messageBubble: {
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
    marginRight: 4,
    color: Colors.tertiary,
  },
});
