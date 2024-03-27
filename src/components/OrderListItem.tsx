import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import React from "react";
import Colors from "../lib/constants/Colors";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { router, useSegments } from "expo-router";
import { Tables } from "../lib/types";
import Animated, { SharedValue, SlideInDown } from "react-native-reanimated";
import useAnimatedFlatList from "@/lib/hooks/useAnimatedFlatList";
dayjs.extend(relativeTime);

export const NOTIFICATION_HEIGHT = 70;

interface OrderListItemProps {
  order: Tables<"orders">;
  index?: number;
  scrollY?: SharedValue<number>;
}

export default function OrderListItem({
  order,
  index,
  scrollY,
}: OrderListItemProps) {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const { animatedStyle } = useAnimatedFlatList({
    scrollY,
    NOTIFICATION_HEIGHT,
    index,
  });

  return (
    <Animated.View
      entering={SlideInDown}
      style={[
        animatedStyle,
        {
          backgroundColor: Colors[colorScheme ?? "light"].foreground,
          height: NOTIFICATION_HEIGHT - 10,
        },
      ]}
    >
      <Pressable
        style={styles.container}
        onPress={() => router.push(`/${segments[0]}/orders/${order.id}`)}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            <Text
              style={[
                styles.title,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              Order #{order.id}
            </Text>
            <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
              -
            </Text>
            <Text
              style={[
                styles.price,
                { color: Colors[colorScheme ?? "light"].tint },
              ]}
            >
              ${order.total.toFixed(2)}
            </Text>
          </View>
          <View style={styles.subtitleContainer}>
            <Text style={{ color: Colors[colorScheme ?? "light"].subText }}>
              {dayjs(order.created_at).fromNow()}
            </Text>
          </View>
        </View>
        <View>
          <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
            {order.status}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "500",
    fontSize: 16,
  },
  subtitleContainer: {
    flexDirection: "row",
    gap: 5,
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
