import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import Colors from "../lib/constants/Colors";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { router, useSegments } from "expo-router";
import { Tables } from "../lib/types";
dayjs.extend(relativeTime);

interface OrderListItemProps {
  order: Tables<"orders">;
}

export default function OrderListItem({ order }: OrderListItemProps) {
  const segments = useSegments();
  return (
    <Pressable
      onPress={() => router.push(`/${segments[0]}/orders/${order.id}`)}
      style={styles.container}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
          <Text style={styles.title}>Order #{order.id}</Text>
          <Text>-</Text>
          <Text style={styles.price}>${order.total.toFixed(2)}</Text>
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.time}>{dayjs(order.created_at).fromNow()}</Text>
        </View>
      </View>
      <View>
        <Text>{order.status}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
    color: Colors.light.tint,
    fontWeight: "bold",
    fontSize: 16,
  },
  time: {
    color: "gray",
  },
});
