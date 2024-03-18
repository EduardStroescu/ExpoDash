import LogoutButton from "@/components/logoutButton/LogoutButton";
import Colors from "@/lib/constants/Colors";
import { View, Text, useColorScheme } from "react-native";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 10,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <LogoutButton />
    </View>
  );
}
