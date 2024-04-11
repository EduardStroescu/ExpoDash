import Button from "@/components/Button";
import PageError from "@/components/PageError";
import RemoteImage from "@/components/RemoteImage";
import Header from "@/components/webOnlyComponents/Header";
import { ProductSize } from "@/lib/types";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, useColorScheme } from "react-native";
import {
  GetProps,
  ScrollView,
  Text,
  Theme,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import { useProduct } from "../../api/products";

const sizes: ProductSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const theme = useTheme();
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0],
  );
  const { data: product, error, isLoading } = useProduct(id);
  const colorScheme = useColorScheme();
  const [selectedSize, setSelectedSize] = useState<ProductSize>("M");
  const [price, setPrice] = useState<number | undefined>(12);

  useEffect(() => {
    if (product) {
      setPrice(
        parseFloat(
          product[
            `${selectedSize?.toLowerCase()}_price` as keyof Pick<
              typeof product,
              "l_price" | "m_price" | "s_price" | "xl_price"
            >
          ].toFixed(2),
        ),
      );
    }
  }, [product, selectedSize]);

  if (error) {
    return <PageError />;
  }

  return (
    <Theme name={colorScheme}>
      <Stack.Screen
        options={{
          title: product?.name,
          headerRight: () => (
            <Link href={`/admin/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={theme.blue10.val}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      {Platform.OS === "web" && <Header slug={id} />}

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
          <XStack {...styles.sizes}>
            <Text {...styles.rowTitle}>Sizes</Text>
            {sizes.map((size) => {
              return (
                <Button
                  key={size}
                  {...styles.size}
                  circular
                  backgroundColor={
                    selectedSize === size ? "$blue10" : "$background"
                  }
                  fontSize={20}
                  color={selectedSize === size ? "$color" : "$color10"}
                  fontWeight="bold"
                  // @ts-ignore: workaround
                  hoverStyle={{ backgroundColor: "$blue10", color: "$color" }}
                  onPress={() => setSelectedSize(size)}
                  text={size}
                />
              );
            })}
          </XStack>
          <XStack alignSelf="center" alignItems="center" paddingBottom={40}>
            <Text {...styles.rowTitle}>Price </Text>
            <Text {...styles.price}>${price}</Text>
          </XStack>
        </YStack>
      </ScrollView>
    </Theme>
  );
}

interface StyleTypes {
  container: GetProps<typeof ScrollView>;
  price: GetProps<typeof Text>;
  description: GetProps<typeof Text>;
  sizes: GetProps<typeof XStack>;
  size: GetProps<typeof Button>;
  rowTitle: GetProps<typeof Text>;
}

const styles: StyleTypes = {
  container: {
    width: "100%",
    padding: 10,
    backgroundColor: "$background",
    $gtXs: { paddingHorizontal: 40 },
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    color: "$blue10",
  },
  description: {
    marginTop: 20,
    alignSelf: "center",
    color: "$color10",
  },
  sizes: {
    alignItems: "center",
    marginVertical: 20,
    gap: "$2",
    alignSelf: "center",
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
};
