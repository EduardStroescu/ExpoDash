import { Tabs, withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/src/lib/constants/Colors";

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function OrderListNavigator() {
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: Colors.light.background }}
    >
      <TopTabs>
        <TopTabs.Screen name="index" options={{ title: "Active" }} />
        <TopTabs.Screen name="archive" options={{ title: "Fulfilled" }} />
      </TopTabs>
    </SafeAreaView>
  );
}
