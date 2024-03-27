import { View, Text, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import Colors from "../lib/constants/Colors";
import { Tables } from "../lib/types";
import { defaultPizzaImage } from "@assets/data/products";
import RemoteImage from "./RemoteImage";
import Animated, { SharedValue, SlideInDown } from "react-native-reanimated";
import useAnimatedFlatList from "@/lib/hooks/useAnimatedFlatList";

export const NOTIFICATION_HEIGHT = 100;

type OrderItemListItemProps = {
  item: { products: Tables<"products"> | null } & Tables<"order_items">;
  index?: number;
  scrollY?: SharedValue<number>;
};

const OrderItemListItem = ({
  item,
  index,
  scrollY,
}: OrderItemListItemProps) => {
  const colorScheme = useColorScheme();
  const { animatedStyle } = useAnimatedFlatList({
    NOTIFICATION_HEIGHT,
    scrollY,
    index,
  });
  return (
    <Animated.View
      entering={SlideInDown}
      style={[
        animatedStyle,
        {
          height: NOTIFICATION_HEIGHT - 10,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: Colors[colorScheme ?? "light"].foreground,
          },
        ]}
      >
        <RemoteImage
          path={item.products?.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.title,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              {item.products?.name}
            </Text>
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              {" "}
              -{" "}
            </Text>
            <Text
              style={[
                styles.price,
                { color: Colors[colorScheme ?? "light"].tint },
              ]}
            >
              ${item.products?.price.toFixed(2)}
            </Text>
          </View>
          <View style={styles.subtitleContainer}>
            <Text style={{ color: Colors[colorScheme ?? "light"].subText }}>
              Size: {item.size}
            </Text>
          </View>
        </View>
        <View style={styles.quantitySelector}>
          <Text
            style={[
              styles.quantity,
              { color: Colors[colorScheme ?? "light"].text },
            ]}
          >
            {item.quantity}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: 75,
    aspectRatio: 1,
    alignSelf: "center",
    marginRight: 10,
  },
  title: {
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
    fontWeight: "500",
    fontSize: 18,
  },
  price: {
    fontWeight: "bold",
  },
});

export default OrderItemListItem;
