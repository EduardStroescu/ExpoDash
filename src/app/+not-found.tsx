import Button from "@/components/Button";
import { Link, Stack } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import { Text, Theme, YStack } from "tamagui";

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  return (
    <Theme name={colorScheme}>
      <Stack.Screen
        options={{
          headerShown: Platform.OS === "web" ? false : true,
          title: "Oops!",
        }}
      />
      <YStack
        width="100%"
        height="100%"
        gap="$10"
        alignItems="center"
        justifyContent="center"
        padding={20}
      >
        <Text color="$red9" fontSize="$9" textAlign="center">
          We're sorry! This page does not exist.
        </Text>
        <Link href="/">
          <Button color="$blue10">Go back to Home Page</Button>
        </Link>
      </YStack>
    </Theme>
  );
}
