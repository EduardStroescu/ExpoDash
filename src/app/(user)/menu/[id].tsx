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
import Colors from "@/lib/constants/Colors";
import Header from "@/components/webOnlyComponents/Header";
import { setIsLoading } from "@/lib/features/appSlice";
import {
  ScrollView,
  Text,
  Theme,
  View,
  Button as Pressable,
  YStack,
} from "tamagui";
import Input from "@/components/Input";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");
  const [selectedQuantity, setSelectedQuantity] = useState<string>("1");
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
          quantity: parseFloat(selectedQuantity),
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
              width: 500,
              height: 500,
              aspectRatio: 1,
              alignSelf: "center",
            }}
            resizeMode="contain"
          />

          <View marginTop={20}>
            <Text {...styles.sizeText}>Select size</Text>
            <View {...styles.sizes}>
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
            </View>
            <View {...styles.sizes}>
              <Text {...styles.sizeText}>Select Quantity</Text>
              <Input
                defaultValue="1"
                inputMode="numeric"
                onChangeText={setSelectedQuantity}
              />
            </View>
          </View>
          <Text {...styles.price}>Price: ${product?.price}</Text>
          <Text {...styles.description}>
            Product Description: {product?.description}
          </Text>
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
    flexDirection: "row",
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
};
