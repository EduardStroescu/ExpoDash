import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Colors from "../lib/constants/Colors";
import { Tables } from "../lib/types";
import { defaultPizzaImage } from "@assets/data/products";
import { router, useSegments } from "expo-router";
import RemoteImage from "./RemoteImage";
import useAnimatedFlatList from "@/lib/hooks/useAnimatedFlatList";
import Animated, { SharedValue, SlideInDown } from "react-native-reanimated";
import { useWindowDimensions } from "tamagui";

interface ProductListItemProps {
  product: Tables<"products">;
  index: number;
  scrollY: SharedValue<number>;
}

export default function ProductListItem({
  product,
  index,
  scrollY,
}: ProductListItemProps) {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const segments = useSegments();
  const NOTIFICATION_HEIGHT = width <= 660 ? 200 : 69.8;
  const { animatedStyle } = useAnimatedFlatList({
    scrollY,
    NOTIFICATION_HEIGHT,
    index,
  });

  return (
    <Animated.View
      entering={SlideInDown}
      style={[
        animatedStyle,
        {
          flex: 1 / 6,
          height: width <= 660 ? NOTIFICATION_HEIGHT - 10 : "auto",
        },
      ]}
    >
      <Pressable
        style={styles.container}
        onPress={() =>
          router.push({
            pathname: `${segments[0]}/menu/[id]`,
            params: { id: product.id },
          })
        }
      >
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={[styles.image, { height: Platform.OS === "web" ? 300 : 120 }]}
          resizeMode="contain"
        />
        <View style={styles.secondaryContainer}>
          <Text
            style={[
              styles.title,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            {product.name}
          </Text>
          <Text
            style={[
              styles.price,
              { color: Colors[colorScheme ?? "light"].tint },
            ]}
          >
            ${product.price}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  secondaryContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },
  image: { width: "100%", borderRadius: 20, objectFit: "cover" },
  title: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  price: { fontWeight: "bold" },
});
