import LogoutButton from "@/src/components/LogoutButton";
import { View, Text } from "react-native";

export default function profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <LogoutButton />
    </View>
  );
}
