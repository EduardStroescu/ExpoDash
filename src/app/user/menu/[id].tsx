import Button from "@/components/Button";
import Input from "@/components/Input";
import PageError from "@/components/PageError";
import RemoteImage from "@/components/RemoteImage";
import Header from "@/components/webOnlyComponents/Header";
import { ToastOptions } from "@/lib/constants/ToastOptions";
import { addToCart } from "@/lib/features/cartSlice";
import { ProductSize } from "@/lib/types";
import { toast } from "@backpackapp-io/react-native-toast";
import { FontAwesome } from "@expo/vector-icons";
import { randomUUID } from "expo-crypto";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, useColorScheme } from "react-native";
import { useDispatch } from "react-redux";
import {
  GetProps,
  ScrollView,
  Text,
  Theme,
  View,
  XStack,
  YStack,
} from "tamagui";
import { useProduct } from "../../api/products";

const sizes: ProductSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0],
  );
  const { data: product, error, isLoading } = useProduct(Number(id));

  const [selectedSize, setSelectedSize] = useState<ProductSize>("M");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number | undefined>(12);

  useEffect(() => {
    if (product) {
      setPrice(
        parseFloat(
          (
            product[
              `${selectedSize?.toLowerCase()}_price` as keyof Pick<
                typeof product,
                "l_price" | "m_price" | "s_price" | "xl_price"
              >
            ] * selectedQuantity
          ).toFixed(2),
        ),
      );
    }
  }, [product, selectedQuantity, selectedSize]);

  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const onAddToCart = () => {
    if (product && selectedSize && selectedQuantity) {
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
            gap="$3"
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
              width="100%"
              aspectRatio={1}
              alignSelf="center"
              resizeMode="cover"
              placeholderStyle={{
                width: 500,
                height: "100%",
                aspectRatio: 1,
                alignSelf: "center",
              }}
              $gtXs={{ width: "100%", height: "auto" }}
              $gtLg={{ width: "50%", height: "auto" }}
            />
            <Text
              {...styles.rowTitle}
              fontWeight="800"
              color="$blue10"
              marginTop={10}
              fontSize={20}
            >
              {product?.name}
            </Text>
            <YStack>
              <Text {...styles.rowTitle}>Product Description:</Text>
              <Text {...styles.description}>{product?.description}</Text>
            </YStack>
            <View
              justifyContent="center"
              alignItems="center"
              width="100%"
              $gtXs={{ flexDirection: "row", gap: "$5" }}
            >
              <Text {...styles.rowTitle}>Select size</Text>
              <XStack {...styles.sizes}>
                {sizes.map((size) => {
                  return (
                    <Button
                      key={size}
                      {...styles.size}
                      circular
                      backgroundColor={
                        selectedSize === size ? "$blue10" : "$background"
                      }
                      color={selectedSize === size ? "$color" : "$color10"}
                      fontSize={20}
                      fontWeight="bold"
                      hoverStyle={{
                        backgroundColor: "$blue10",
                        // @ts-ignore: workaround
                        color: "$color",
                      }}
                      onPress={() => setSelectedSize(size)}
                      text={size}
                    />
                  );
                })}
              </XStack>
              <XStack {...styles.sizes}>
                <Text {...styles.rowTitle}>Select Quantity</Text>
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
            <XStack alignSelf="center" alignItems="center">
              <Text {...styles.rowTitle}>Price </Text>
              <Text {...styles.price}>${price}</Text>
            </XStack>
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

interface StyleTypes {
  container: GetProps<typeof ScrollView>;
  price: GetProps<typeof Text>;
  sizes: GetProps<typeof View>;
  size: GetProps<typeof Button>;
  rowTitle: GetProps<typeof Text>;
  description: GetProps<typeof Text>;
  quantitySelector: GetProps<typeof XStack>;
}

const styles: StyleTypes = {
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
  rowTitle: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: "$color",
  },
  description: {
    marginTop: 20,
    alignSelf: "center",
    color: "$color10",
  },
  quantitySelector: {
    alignItems: "center",
    gap: 10,
  },
};
