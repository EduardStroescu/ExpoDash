import React, { useState } from "react";
import { Tables } from "../lib/types";
import RemoteImage from "./RemoteImage";
import Animated, { SharedValue, SlideInDown } from "react-native-reanimated";
import useAnimatedFlatList from "@/lib/hooks/useAnimatedFlatList";
import { GetProps, Text, View } from "tamagui";
import { LayoutChangeEvent } from "react-native";
import { imagePlaceholder } from "@/lib/constants/imagePlaceholder";

type OrderItemListItemProps = {
  item: { products: Tables<"products"> | null } & Tables<"order_items">;
  index: number;
  scrollY: SharedValue<number>;
};

const OrderItemListItem = ({
  item,
  index,
  scrollY,
}: OrderItemListItemProps) => {
  const [height, setHeight] = useState(110);
  const NOTIFICATION_HEIGHT = height + 25;

  const { animatedStyle } = useAnimatedFlatList({
    NOTIFICATION_HEIGHT,
    scrollY,
    index,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  };
  const itemPrice =
    item &&
    (
      (item.products?.[
        `${item.size.toLowerCase()}_price` as keyof Pick<
          typeof item.products,
          "s_price" | "m_price" | "l_price" | "xl_price"
        >
      ] as number) * item?.quantity
    ).toFixed(2);

  return (
    <Animated.View
      onLayout={onLayout}
      entering={SlideInDown}
      style={[
        animatedStyle,
        {
          height: 80,
        },
      ]}
    >
      <View {...styles.container}>
        <RemoteImage
          {...styles.image}
          path={item.products?.image}
          fallback={imagePlaceholder}
          resizeMode="contain"
        />
        <View flex={1}>
          <View flexDirection="row">
            <Text {...styles.title}>
              {`${item.products?.name?.substring(0, 17)}...`}
            </Text>
            <Text color="white"> - </Text>
            <Text {...styles.price}>${itemPrice}</Text>
          </View>
          <View {...styles.subtitleContainer}>
            <Text color="$color10">Size: {item.size}</Text>
          </View>
        </View>
        <View {...styles.quantitySelector}>
          <Text {...styles.quantity}>{item.quantity}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

interface StyleTypes {
  container: GetProps<typeof View>;
  image: GetProps<typeof RemoteImage>;
  title: GetProps<typeof Text>;
  subtitleContainer: GetProps<typeof View>;
  quantitySelector: GetProps<typeof View>;
  quantity: GetProps<typeof Text>;
  price: GetProps<typeof Text>;
}

const styles: StyleTypes = {
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#262626",
  },
  image: {
    width: 75,
    aspectRatio: 1,
    alignSelf: "center",
    marginRight: 10,
  },
  title: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: "row",
    gap: 5,
  },
  quantitySelector: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginRight: 10,
  },
  quantity: {
    color: "$blue10",
    fontWeight: "500",
    fontSize: 18,
  },
  price: {
    color: "$blue10",
    fontWeight: "bold",
  },
};

export default OrderItemListItem;
