import { LayoutChangeEvent, Pressable } from "react-native";
import { Tables } from "../lib/types";
import { defaultPizzaImage } from "@assets/data/products";
import { router, useSegments } from "expo-router";
import RemoteImage from "./RemoteImage";
import useAnimatedFlatList from "@/lib/hooks/useAnimatedFlatList";
import Animated, { SharedValue, SlideInDown } from "react-native-reanimated";
import { GetProps, XStack, YStack, useWindowDimensions } from "tamagui";
import { Text } from "tamagui";
import React, { useState } from "react";
import { useResponsiveStyle } from "@/lib/hooks/useResponsiveStyle";

interface ProductListItemProps {
  product: Tables<"products">;
  index: number;
  scrollY: SharedValue<number>;
  columnNumber: number;
}

export default function ProductListItem({
  product,
  index,
  scrollY,
  columnNumber,
}: ProductListItemProps) {
  const [height, setHeight] = useState(150);
  const { width } = useWindowDimensions();
  const segments = useSegments();
  const columnBreakpoints = {
    default: height,
    sm: height,
    md: (25 / 100) * (columnNumber * height),
    gtMd: (12 / 100) * (columnNumber * height),
    lg: (7.7 / 100) * (columnNumber * height),
    xl: (3.6 / 100) * (columnNumber * height),
    gtXl: (3.65 / 100) * (columnNumber * height),
  };
  const NOTIFICATION_HEIGHT = useResponsiveStyle(columnBreakpoints, width);

  const { animatedStyle } = useAnimatedFlatList({
    scrollY,
    NOTIFICATION_HEIGHT,
    index,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  };

  return (
    <Animated.View
      onLayout={onLayout}
      entering={SlideInDown}
      style={[
        animatedStyle,
        {
          flex: 1 / columnNumber,
        },
      ]}
    >
      <Pressable
        style={{ flex: 1, paddingHorizontal: 10 }}
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
          placeholderStyle={{
            height: width <= 600 ? 110 : 300,
            width: "100%",
            borderRadius: 20,
            objectFit: "cover",
            alignSelf: "center",
          }}
          resizeMode="cover"
        />
        <YStack {...styles.primaryContainer}>
          <Text {...styles.productDescription}>
            {product.description?.length >= 200
              ? `${product.description?.slice(0, 200)}...`
              : product.description}
          </Text>
          <XStack {...styles.secondaryContainer}>
            <Text {...styles.title}>{product.name}</Text>
            <Text {...styles.price}>${product.price}</Text>
          </XStack>
        </YStack>
      </Pressable>
    </Animated.View>
  );
}

interface StyleProps {
  primaryContainer: GetProps<typeof YStack>;
  secondaryContainer: GetProps<typeof XStack>;
  title: GetProps<typeof Text>;
  productDescription: GetProps<typeof Text>;
  price: GetProps<typeof Text>;
}

const styles: StyleProps = {
  primaryContainer: {
    width: "100%",
    padding: 10,
  },
  secondaryContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "$color",
  },
  productDescription: {
    fontSize: 11,
    color: "$color10",
  },
  price: { fontWeight: "bold", color: "$blue10" },
};
