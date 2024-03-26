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

interface ProductListItemProps {
  product: Tables<"products">;
}

export default function ProductListItem({ product }: ProductListItemProps) {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  return (
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
        style={[styles.image, { height: Platform.OS === "web" ? 500 : 120 }]}
        resizeMode="contain"
      />
      <View style={styles.secondaryContainer}>
        <Text
          style={[styles.title, { color: Colors[colorScheme ?? "light"].text }]}
        >
          {product.name}
        </Text>
        <Text
          style={[styles.price, { color: Colors[colorScheme ?? "light"].tint }]}
        >
          ${product.price}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1 / 2,
  },
  secondaryContainer: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: { width: "100%", borderRadius: 20, objectFit: "cover" },
  title: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  price: { fontWeight: "bold" },
});
