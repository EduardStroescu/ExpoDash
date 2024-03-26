import { Link, Redirect, usePathname } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import Button, { ButtonProps } from "../components/Button";
import { useSelector } from "react-redux";
import { RootState } from "../lib/reduxStore";
import LogoutButton from "../components/logoutButton/LogoutButton";
import { useSession } from "../lib/hooks/useSession";
import { StatusBar } from "expo-status-bar";
import { Stats } from "@/components/stats/Stats";
import SvgBackground from "@/components/svgBackground/SvgBackground";
import Meta from "@/components/Meta";
import AnimatedLoader from "@/components/AnimatedLoader";
import { Text, Theme, View, XStack, YStack, useTheme } from "tamagui";
import { InlineGradient } from "@/components/cart/InlineGradient";

export default function Page() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const pathname = usePathname();
  useSession();
  const { session, loading, isAdmin } = useSelector(
    (state: RootState) => state.auth,
  );
  if (loading) {
    return <AnimatedLoader overwriteState={true} />;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (!isAdmin) {
    return <Redirect href="/(user)" />;
  }

  return (
    <Theme name={colorScheme}>
      {Platform.OS === "web" && <Meta />}
      {pathname === "/" && (
        <StatusBar animated style={Platform.OS === "ios" ? "light" : "auto"} />
      )}

      <View {...styles.page}>
        {Platform.OS !== "web" && <SvgBackground />}

        <YStack {...styles.container}>
          <View>{session && <Stats />}</View>
          <View
            overflow="hidden"
            style={{ borderRadius: 20 }}
            borderRadius={20}
            marginBottom={10}
          >
            <InlineGradient
              colors={["transparent", theme.color1.val, "transparent"]}
              width={Platform.OS !== "web" ? [-50, -50] : [10, 10]}
            />
            <Text
              {...styles.subtitle}
              style={{
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
              Proceed as:
            </Text>
          </View>
          <XStack {...styles.buttonContainer}>
            <Link href="/(user)" asChild>
              <Button {...styles.button} text="User" />
            </Link>
            <Link href="/(admin)" asChild>
              <Button {...styles.button} text="Admin" />
            </Link>
          </XStack>
          <LogoutButton />
        </YStack>
      </View>
    </Theme>
  );
}
interface StyleTypes {
  page: React.ComponentPropsWithoutRef<typeof View>;
  container: React.ComponentPropsWithoutRef<typeof YStack>;
  subtitle: React.ComponentPropsWithoutRef<typeof Text>;
  buttonContainer: React.ComponentPropsWithoutRef<typeof XStack>;
  button: ButtonProps;
}

const styles: StyleTypes = {
  page: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: "$1",
  },
  container: {
    gap: "$4",
    width: "100%",
    $gtMd: { width: "30%" },
    padding: 10,
  },
  subtitle: {
    color: "$color",
    textAlign: "center",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
    textShadowColor: "$background",
    fontSize: "$7",
    paddingVertical: 10,
  },
  buttonContainer: {
    justifyContent: "space-between",
    gap: "$2",
    alignItems: "center",
  },
  button: {
    fontSize: 16,
    flex: 1,
  },
};
