import Colors from "@/lib/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, usePathname } from "expo-router";
import {
  ColorSchemeName,
  Platform,
  Pressable,
  View,
  useColorScheme,
} from "react-native";

export default function MenuStack() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  return (
    <Stack
      screenOptions={{
        headerShown: Platform.OS === "web" ? false : true,
        contentStyle: {
          backgroundColor: "black",
        },
        headerRight: () => renderHeaderRight(pathname, colorScheme),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Menu",
        }}
      />
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="cart"
        options={{
          presentation: "modal",
          title: "Cart",
          headerShown: Platform.OS === "web" ? false : true,
        }}
      />
    </Stack>
  );
}

const renderHeaderRight = (pathname: string, colorScheme: ColorSchemeName) => {
  if (!pathname?.includes("cart")) {
    return (
      <Link href="/(user)/menu/cart" asChild>
        <Pressable>
          {({ pressed }) => (
            <FontAwesome
              name="shopping-cart"
              size={25}
              color={Colors[colorScheme ?? "light"].tint}
              style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
      </Link>
    );
  } else {
    return <View />;
  }
};
