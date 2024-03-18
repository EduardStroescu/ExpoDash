import { Link, Redirect, usePathname } from "expo-router";
import { ActivityIndicator, Platform, View } from "react-native";
import Button from "../components/Button";
import { useSelector } from "react-redux";
import { RootState } from "../lib/reduxStore";
import LogoutButton from "../components/logoutButton/LogoutButton";
import { useSession } from "../lib/hooks/useSession";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { Stats } from "@/components/stats/Stats";
import SvgBackground from "@/components/svgBackground/SvgBackground";

export default function Page() {
  const pathname = usePathname();
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
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 10,
        backgroundColor: "black",
      }}
    >
      {session && <Stats />}
      <Text
        style={{
          color: "purple",
          fontSize: 20,
          fontStyle: "italic",
          fontWeight: "bold",
          marginVertical: 20,
          backgroundColor: "#ffffffdc",
          width: "100%",
          textAlign: "center",
          borderRadius: 20,
          overflow: "hidden",
          paddingVertical: 10,
          textShadowColor: "white",
          textShadowOffset: { width: -1, height: 1 },
          textShadowRadius: 10,
        }}
      >
        Proceed as:
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Link href="/(user)" asChild>
          <Button text="User" style={{ flex: 1 }} />
        </Link>
        <Link href="/(admin)" asChild>
          <Button text="Admin" style={{ flex: 1 }} />
        </Link>
      </View>
      <SvgBackground />
      {pathname === "/" && (
        <StatusBar animated style={Platform.OS === "ios" ? "light" : "auto"} />
      )}
      <LogoutButton />
    </View>
  );
}
