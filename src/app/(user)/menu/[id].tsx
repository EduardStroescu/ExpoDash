import { useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "@/src/components/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/src/lib/features/cartSlice";
import { PizzaSize } from "@/src/lib/types";
import { randomUUID } from "expo-crypto";
import { useProduct } from "../../api/products";
import { defaultPizzaImage } from "@/assets/data/products";
import RemoteImage from "@/src/components/RemoteImage";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const dispatch = useDispatch();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, error, isLoading } = useProduct(Number(id));

  const onAddToCart = () => {
    if (product && selectedQuantity) {
      dispatch(
        addToCart({
          id: randomUUID(),
          product_id: product.id,
          product: product,
          size: selectedSize,
          quantity: selectedQuantity,
        })
      );
      router.push("/cart");
    }
    return;
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name }} />

      <RemoteImage
        path={product?.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />

      <Text>Select size</Text>
      <View style={styles.sizes}>
        {sizes.map((size) => {
          return (
            <Pressable
              key={size}
              style={[
                styles.size,
                {
                  backgroundColor:
                    selectedSize === size ? "gainsboro" : "white",
                },
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[
                  styles.sizeText,
                  { color: selectedSize === size ? "black" : "grey" },
                ]}
              >
                {size}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.price}>${product?.price}</Text>
      <Button text="Add to cart" onPress={onAddToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 10 },
  image: {
    width: "100%",
    aspectRatio: 1.5,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "auto",
    alignSelf: "center",
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  size: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
