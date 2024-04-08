import { Href, Link, useSegments } from "expo-router";
import { Text, Theme, YStack } from "tamagui";
import Button from "./Button";
import { useColorScheme } from "react-native";

export default function PageError() {
  const segments = useSegments();
  const colorScheme = useColorScheme();
  return (
    <Theme name={colorScheme}>
      <YStack
        width="100%"
        height="100%"
        gap="$10"
        alignItems="center"
        justifyContent="center"
        padding={20}
      >
        <Text color="$red9" fontSize="$9" textAlign="center">
          There has been a network error. Please refresh or try again later!
        </Text>
        <Link href={`/${segments[0]}/` as Href<string>}>
          <Button color="$blue10">Go back Home</Button>
        </Link>
      </YStack>
    </Theme>
  );
}
