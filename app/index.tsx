import { useState } from "react";
import { Button } from "@/components/Button";
import { View } from "react-native";
import { DisplayNamePrompt } from "@/components/DisplayNamePrompt";

export default function Index() {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DisplayNamePrompt
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
      />
      <Button size="lg" onPress={() => setIsPromptOpen(true)}>
        Let's go
      </Button>
    </View>
  );
}
