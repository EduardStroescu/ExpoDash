import { useEffect, useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import Button from "@/components/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { PizzaSize } from "@/lib/types";
import { randomUUID } from "expo-crypto";
import { useProduct } from "../../api/products";
import { defaultPizzaImage } from "@assets/data/products";
import RemoteImage from "@/components/RemoteImage";
import Header from "@/components/webOnlyComponents/Header";
import { setIsLoading } from "@/lib/features/appSlice";
import {
  ScrollView,
  Text,
  Theme,
  View,
  Button as Pressable,
  YStack,
  XStack,
} from "tamagui";
import Input from "@/components/Input";
import { FontAwesome } from "@expo/vector-icons";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0],
  );
  const { data: product, error, isLoading } = useProduct(Number(id));

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number | undefined>(12);

  useEffect(() => {
    if (product) {
      setPrice(parseFloat((product.price * selectedQuantity).toFixed(2)));
    }
  }, [selectedQuantity, product]);

  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

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
    <Theme name={colorScheme}>
      <Stack.Screen options={{ title: product?.name }} />
      {Platform.OS === "web" && <Header slug={id} />}

      <ScrollView {...styles.container}>
        <YStack $gtMd={{ width: "30%", alignSelf: "center" }}>
          <RemoteImage
            path={product?.image}
            fallback={defaultPizzaImage}
            style={{
              width: 400,
              height: 400,
              aspectRatio: 1,
              alignSelf: "center",
            }}
            resizeMode="contain"
          />
          <Text {...styles.description}>
            Product Description: {product?.description}
          </Text>
          <View marginTop={20}>
            <Text {...styles.sizeText}>Select size</Text>
            <XStack {...styles.sizes}>
              {sizes.map((size) => {
                return (
                  <Pressable
                    key={size}
                    {...styles.size}
                    circular
                    backgroundColor={
                      selectedSize === size ? "$blue10" : "$background"
                    }
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      {...styles.sizeText}
                      color={selectedSize === size ? "$color" : "$color10"}
                    >
                      {size}
                    </Text>
                  </Pressable>
                );
              })}
            </XStack>
            <XStack {...styles.sizes}>
              <Text {...styles.sizeText}>Select Quantity</Text>
              <XStack {...styles.quantitySelector}>
                <FontAwesome
                  onPress={() =>
                    setSelectedQuantity((prev) => (prev <= 1 ? 1 : prev - 1))
                  }
                  name="minus"
                  color="gray"
                  style={{ padding: 5 }}
                />
                <Input
                  width={50}
                  padding={0}
                  textAlign="center"
                  inputMode="numeric"
                  value={String(selectedQuantity)}
                  onChangeText={(t) =>
                    !isNaN(parseFloat(t))
                      ? setSelectedQuantity(parseFloat(t))
                      : 1
                  }
                />
                <FontAwesome
                  onPress={() => setSelectedQuantity((prev) => prev + 1)}
                  name="plus"
                  color="gray"
                  style={{ padding: 5 }}
                />
              </XStack>
            </XStack>
          </View>
          <Text {...styles.price}>Price: ${price}</Text>
          <Button
            marginVertical={20}
            text="Add to cart"
            onPress={onAddToCart}
          />
        </YStack>
      </ScrollView>
    </Theme>
  );
}

interface StyleProps {
  container: React.PropsWithoutRef<typeof ScrollView>;
  price: React.PropsWithoutRef<typeof Text>;
  sizes: React.PropsWithoutRef<typeof View>;
  size: React.PropsWithoutRef<typeof Pressable>;
  sizeText: React.PropsWithoutRef<typeof Text>;
  description: React.PropsWithoutRef<typeof Text>;
  quantitySelector: React.PropsWithoutRef<typeof XStack>;
}

const styles: StyleProps = {
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "$background",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "auto",
    alignSelf: "center",
    color: "$blue10",
  },
  sizes: {
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 20,
  },
  size: {
    width: 50,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    color: "$color",
  },
  description: {
    marginTop: 20,
    alignSelf: "center",
    textAlign: "justify",
    color: "$color",
  },
  quantitySelector: {
    alignItems: "center",
    gap: 10,
  },
};
