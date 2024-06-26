import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "./styles.css";

import AnimatedLoader from "@/components/AnimatedLoader";
import Navbar from "@/components/webOnlyComponents/Navbar";
import { useSession } from "@/lib/hooks/useSession";
import StripePlatformProvider from "@/lib/providers/StripePlatformProvider";
import { Toasts } from "@backpackapp-io/react-native-toast";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { TamaguiProvider } from "tamagui";
import config from "tamagui.config";
import { useColorScheme } from "../components/useColorScheme/useColorScheme";
import QueryProvider from "../lib/providers/QueryProvider";
import { store } from "../lib/reduxStore";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  useSession();

  return (
    <ThemeProvider value={colorScheme === "light" ? DefaultTheme : DarkTheme}>
      <TamaguiProvider config={config} defaultTheme="light">
        <StripePlatformProvider>
          <QueryProvider>
            <AnimatedLoader />
            <GestureHandlerRootView style={{ flex: 1 }}>
              {Platform.OS === "web" && <Navbar />}
              <Stack
                screenOptions={{
                  headerShown: Platform.OS === "web" ? false : true,
                  contentStyle: {
                    backgroundColor: "#000000",
                  },
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="admin" options={{ headerShown: false }} />
                <Stack.Screen name="user" options={{ headerShown: false }} />
              </Stack>
              <Toasts />
            </GestureHandlerRootView>
          </QueryProvider>
        </StripePlatformProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}
