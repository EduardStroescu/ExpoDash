import { useEffect, useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Button from "@/components/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { PizzaSize } from "@/lib/types";
import { randomUUID } from "expo-crypto";
import { useProduct } from "../../api/products";
import { defaultPizzaImage } from "@assets/data/products";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/lib/constants/Colors";
import Header from "@/components/webOnlyComponents/Header";
import { setIsLoading } from "@/lib/features/appSlice";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0],
  );

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
        }),
      );
      router.push("/(user)/menu/cart");
    }
    return;
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading(true));
    } else {
      dispatch(setIsLoading(false));
    }
  }, [isLoading, dispatch]);

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <Stack.Screen options={{ title: product?.name }} />

      {Platform.OS === "web" && <Header slug={id} />}

      <RemoteImage
        path={product?.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={{ marginTop: 20 }}>
        <Text
          style={[
            styles.sizeText,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          Select size
        </Text>
        <View style={styles.sizes}>
          {sizes.map((size) => {
            return (
              <Pressable
                key={size}
                style={[
                  styles.size,
                  {
                    backgroundColor:
                      selectedSize === size
                        ? Colors[colorScheme ?? "light"].tint
                        : Colors[colorScheme ?? "light"].foreground,
                  },
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    {
                      color:
                        selectedSize === size
                          ? Colors[colorScheme ?? "light"].text
                          : Colors[colorScheme ?? "light"].subText,
                    },
                  ]}
                >
                  {size}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Text
        style={[styles.price, { color: Colors[colorScheme ?? "light"].tint }]}
      >
        ${product?.price}
      </Text>
      <Button marginVertical={20} text="Add to cart" onPress={onAddToCart} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, justifyContent: "center" },
  image: {
    flex: 1,
    aspectRatio: 1,
    alignSelf: "center",
    objectFit: "contain",
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
    marginVertical: 20,
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
    textAlign: "center",
  },
});
