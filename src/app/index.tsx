import { Link, Redirect, usePathname } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import Button, { ButtonProps } from "../components/Button";
import { useSelector } from "react-redux";
import { RootState } from "../lib/reduxStore";
import LogoutButton from "../components/logoutButton/LogoutButton";
import { StatusBar } from "expo-status-bar";
import { Stats } from "@/components/stats/Stats";
import SvgBackground from "@/components/svgBackground/SvgBackground";
import AnimatedLoader from "@/components/AnimatedLoader";
import { InlineGradient } from "@/components/InlineGradient";
import {
  GetProps,
  ScrollView,
  Text,
  Theme,
  View,
  XStack,
  YStack,
  useTheme,
} from "tamagui";

export default function Page() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const pathname = usePathname();
  const { session, profile, loading, isAdmin } = useSelector(
    (state: RootState) => state.auth,
  );

  if (loading) {
    return <AnimatedLoader overwriteState={true} />;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (session && profile && !isAdmin) {
    return <Redirect href="/user/" />;
  }

  return (
    <Theme name={colorScheme}>
      {pathname === "/" && (
        <StatusBar animated style={Platform.OS === "ios" ? "light" : "auto"} />
      )}
      <SvgBackground />

      <ScrollView {...styles.page}>
        <YStack {...styles.container} id="box-shadow">
          {session && isAdmin && <Stats />}
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
            <Link href="/user/" asChild>
              <Button {...styles.button} text="User" />
            </Link>
            <Link href="/admin/" asChild>
              <Button {...styles.button} text="Admin" />
            </Link>
          </XStack>
          <LogoutButton />
        </YStack>
      </ScrollView>
    </Theme>
  );
}
interface StyleTypes {
  page: GetProps<typeof ScrollView>;
  container: GetProps<typeof YStack>;
  subtitle: GetProps<typeof Text>;
  buttonContainer: GetProps<typeof XStack>;
  button: ButtonProps;
}

const styles: StyleTypes = {
  page: {
    position: "relative",
    width: "100%",
    height: "100%",
    paddingTop: Platform.OS === "web" ? 60 : 0,
    $gtXs: { paddingTop: 0 },
    contentContainerStyle: {
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  container: {
    gap: "$4",
    width: "100%",
    padding: 10,
    $gtSm: {
      width: "40%",
      minWidth: 700,
      maxWidth: 1000,
      backgroundColor: "#0c1033b2",
      borderRadius: 20,
      borderStyle: "double" as "solid",
      borderWidth: 4,
      borderColor: "#7007acff",
    },
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
