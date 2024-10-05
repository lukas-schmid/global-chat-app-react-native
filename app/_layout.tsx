import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          gestureEnabled: false,
          title: "Chat",
          headerBackTitle: "back",
          headerTintColor: "#E85C0D",
        }}
      />
    </Stack>
  );
}
