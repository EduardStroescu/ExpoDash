import { Link, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import Button from "../components/Button";
import { useSelector } from "react-redux";
import { RootState } from "../reduxStore";
import LogoutButton from "../components/LogoutButton";
import { useSession } from "../lib/hooks/useSession";

export default function Page() {
  useSession();
  const { session, loading, isAdmin } = useSelector(
    (state: RootState) => state.auth
  );
  if (loading) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (!isAdmin) {
    return <Redirect href="/(user)" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Link href="/(user)" asChild>
        <Button text="User" />
      </Link>
      <Link href="/(admin)" asChild>
        <Button text="Admin" />
      </Link>

      <LogoutButton />
    </View>
  );
}
