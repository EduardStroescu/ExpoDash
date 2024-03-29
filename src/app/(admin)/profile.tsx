import Button from "@/components/Button";
import LogoutButton from "@/components/logoutButton/LogoutButton";
import Header from "@/components/webOnlyComponents/Header";
import { RootState } from "@/lib/reduxStore";
import { useColorScheme, Platform } from "react-native";
import { useSelector } from "react-redux";
import { Avatar, Card, ScrollView, Text, Theme, XStack, YStack } from "tamagui";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { session } = useSelector((state: RootState) => state.auth);

  return (
    <Theme name={colorScheme}>
      <ScrollView {...styles.page}>
        {Platform.OS === "web" && <Header />}

        <YStack {...styles.container}>
          <Card {...styles.card}>
            <Avatar circular size="$15" elevate elevation="$1">
              <Avatar.Image src="http://picsum.photos/200/300" />
              <Avatar.Fallback bc="red" />
            </Avatar>
            <Card.Footer flexDirection="column" alignItems="center" gap="$4">
              <Text borderRadius="$10">
                {session?.user.email?.split("@")[0]}
              </Text>
              <XStack gap="$2" flexWrap="wrap" justifyContent="center">
                <Button {...styles.smallButton} text="Change Avatar" />
                <Button {...styles.smallButton} text="Change Password" />
                <Button {...styles.smallButton} text="Change Address" />
              </XStack>
            </Card.Footer>
          </Card>
          <LogoutButton {...styles.logoutButton} />
        </YStack>
      </ScrollView>
    </Theme>
  );
}

interface StyleProps {
  page: React.ComponentPropsWithoutRef<typeof ScrollView>;
  container: React.ComponentPropsWithoutRef<typeof YStack>;
  card: React.ComponentPropsWithoutRef<typeof Card>;
  logoutButton: React.ComponentPropsWithoutRef<typeof LogoutButton>;
  smallButton: React.ComponentPropsWithoutRef<typeof Button>;
}

const styles: StyleProps = {
  page: {
    width: "100%",
    height: "100%",
    backgroundColor: "$background",
    contentContainerStyle: { alignItems: "center" },
  },
  container: {
    width: "100%",
    padding: 10,
    $gtMd: { width: "30%" },
    alignItems: "center",
    paddingTop: "$5",
    gap: "$5",
  },
  card: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#232b5d85",
    padding: "$3",
    alignItems: "center",
    gap: "$5",
  },
  smallButton: { fontSize: "$2" },
  logoutButton: { width: "60%", fontSize: 16 },
};
