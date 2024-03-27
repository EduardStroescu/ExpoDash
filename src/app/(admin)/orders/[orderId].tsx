import { View, Text, StyleSheet, useColorScheme } from "react-native";
import React, { useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import OrderStatusSelector from "@/components/OrderStatusSelector";
import { useOrderDetails } from "../../api/orders";
import Colors from "@/lib/constants/Colors";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import AnimatedFlatList from "@/components/AnimatedFlatlist";

export default function OrderDetailsPage() {
  const colorScheme = useColorScheme();
  const { orderId } = useLocalSearchParams();
  const id = parseFloat(typeof orderId === "string" ? orderId : orderId?.[0]);
  const { data: order, isLoading, error } = useOrderDetails(id);

  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading(true));
    } else {
      dispatch(setIsLoading(false));
    }
  }, [isLoading, dispatch]);

  if (error || !order) {
    return <Text>Order not found!</Text>;
  }

  return (
    <>
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
      >
        <Stack.Screen
          options={{
            title: `Order #${orderId}`,
          }}
        />

        <OrderListItem order={order} />

        <AnimatedFlatList
          data={order.order_items}
          renderItem={({ item, index, scrollY }) => (
            <OrderItemListItem item={item} index={index} scrollY={scrollY} />
          )}
          contentContainerStyle={{ gap: 10 }}
        />
      </View>
      <OrderStatusSelector activeStatus={order.status} orderId={id} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flex: 1,
    gap: 10,
  },
});
