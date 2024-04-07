import { useEffect, useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, useColorScheme } from "react-native";
import Button from "@/components/Button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { PizzaSize } from "@/lib/types";
import { randomUUID } from "expo-crypto";
import { useProduct } from "../../api/products";
import RemoteImage from "@/components/RemoteImage";
import Header from "@/components/webOnlyComponents/Header";
import {
  ScrollView,
  Text,
  Theme,
  View,
  Button as Pressable,
  YStack,
  XStack,
  GetProps,
} from "tamagui";
import Input from "@/components/Input";
import { FontAwesome } from "@expo/vector-icons";
import PageError from "@/components/PageError";
import { toast } from "@backpackapp-io/react-native-toast";
import { ToastOptions } from "@/lib/constants/ToastOptions";
import { imagePlaceholder } from "@/lib/constants/imagePlaceholder";

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
      toast.success(
        "Product added to cart successfully!",
        ToastOptions({ iconName: "check" }),
      );
    }
    return;
  };

  if (error) {
    return <PageError />;
  }

  return (
    <Theme name={colorScheme}>
      <Stack.Screen options={{ title: product?.name }} />
      {Platform.OS === "web" && <Header slug={id} />}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={65}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView {...styles.container}>
          <YStack
            $gtXs={{
              width: "60%",
              alignSelf: "center",
              justifyContent: "center",
            }}
            $gtMd={{
              width: "50%",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <RemoteImage
              path={product?.image}
              fallback={imagePlaceholder}
              width="100%"
              aspectRatio={1}
              alignSelf="center"
              resizeMode="cover"
              placeholderStyle={{
                width: 500,
                height: 500,
                aspectRatio: 1,
                alignSelf: "center",
              }}
              $gtXs={{ width: "100%", height: "auto" }}
              $gtLg={{ width: "50%", height: "auto" }}
            />
            <Text {...styles.description}>
              Product Description: {product?.description}
            </Text>
            <View
              marginTop={20}
              justifyContent="center"
              alignItems="center"
              width="100%"
              $gtXs={{ flexDirection: "row", gap: "$5" }}
            >
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
      </KeyboardAvoidingView>
    </Theme>
  );
}

interface StyleProps {
  container: GetProps<typeof ScrollView>;
  price: GetProps<typeof Text>;
  sizes: GetProps<typeof View>;
  size: GetProps<typeof Pressable>;
  sizeText: GetProps<typeof Text>;
  description: GetProps<typeof Text>;
  quantitySelector: GetProps<typeof XStack>;
}

const styles: StyleProps = {
  container: {
    width: "100%",
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
    gap: "$2",
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
