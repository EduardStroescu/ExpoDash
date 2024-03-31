import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";

import Colors from "../../lib/constants/Colors";
import { useColorScheme } from "../../components/useColorScheme/useColorScheme";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reduxStore";
import { Platform } from "react-native";
import AnimatedLoader from "@/components/AnimatedLoader";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { session, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <AnimatedLoader overwriteState={true} />;
  }

  if (!session) {
    return <Redirect href={"/"} />;
  }

  return (
    <Tabs
      sceneContainerStyle={{ backgroundColor: "transparent" }}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: Platform.OS === "web" ? false : true,
        tabBarStyle: { display: Platform.OS === "web" ? "none" : "flex" },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="cutlery" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: Platform.OS !== "web",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
