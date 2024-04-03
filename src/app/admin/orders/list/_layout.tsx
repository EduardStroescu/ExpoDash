import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/lib/constants/Colors";
import { Platform, useColorScheme } from "react-native";

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function OrderListNavigator() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].foreground,
      }}
    >
      <TopTabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].foreground,
            display: Platform.OS === "web" ? "none" : "flex",
          },
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].text,
          tabBarInactiveTintColor: "gainsboro",
        }}
      >
        <TopTabs.Screen name="index" options={{ title: "Active" }} />
        <TopTabs.Screen name="archive" options={{ title: "Fulfilled" }} />
      </TopTabs>
    </SafeAreaView>
  );
}
