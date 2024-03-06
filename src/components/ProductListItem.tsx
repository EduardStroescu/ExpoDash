import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../lib/constants/Colors";
import { Tables } from "../lib/types";
import { defaultPizzaImage } from "@/assets/data/products";
import { router, useSegments } from "expo-router";
import RemoteImage from "./RemoteImage";

interface ProductListItemProps {
  product: Tables<"products">;
}

export default function ProductListItem({ product }: ProductListItemProps) {
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
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: "50%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
  },
  image: { width: "100%", aspectRatio: 1 },
  title: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  price: { color: Colors.light.tint, fontWeight: "bold" },
});
