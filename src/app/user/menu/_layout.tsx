import Colors from "@/lib/constants/Colors";
import { RootState } from "@/lib/reduxStore";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, usePathname } from "expo-router";
import {
  ColorSchemeName,
  Platform,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSelector } from "react-redux";

export default function MenuStack() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const { items } = useSelector((state: RootState) => state.cart);
  const cartItemsNumber = items.length;

  return (
    <Stack
      screenOptions={{
        headerShown: Platform.OS === "web" ? false : true,
        contentStyle: {
          backgroundColor: "black",
        },
        headerRight: () =>
          renderHeaderRight(pathname, colorScheme, cartItemsNumber),
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

const renderHeaderRight = (
  pathname: string,
  colorScheme: ColorSchemeName,
  cartItemsNumber: number,
) => {
  if (!pathname?.includes("cart")) {
    return (
      <Link href="/user/menu/cart" asChild>
        <Pressable>
          {({ pressed }) => (
            <View
              style={{
                position: "relative",
                marginRight: 15,
                opacity: pressed ? 0.5 : 1,
              }}
            >
              <FontAwesome
                name="shopping-cart"
                size={25}
                color={
                  pressed
                    ? Colors[colorScheme ?? "light"].tint
                    : Colors[colorScheme ?? "light"].text
                }
              />
              {cartItemsNumber > 0 && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    backgroundColor: "red",
                    width: 20,
                    height: 20,
                    position: "absolute",
                    right: -12,
                    top: -9,
                  }}
                >
                  <Text
                    style={{
                      color: Colors[colorScheme ?? "light"].text,
                      fontSize: 12,
                    }}
                  >
                    {cartItemsNumber}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Pressable>
      </Link>
    );
  } else {
    return <View />;
  }
};
