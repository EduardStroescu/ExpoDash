import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function MenuStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: Platform.OS === "web" ? false : true,
        contentStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Stack.Screen
        name="list"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
