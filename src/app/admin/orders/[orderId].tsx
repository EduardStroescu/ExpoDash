import { useColorScheme } from "react-native";
import { useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import OrderStatusSelector from "@/components/OrderStatusSelector";
import { useOrderDetails } from "../../api/orders";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import AnimatedFlatList from "@/components/AnimatedFlatlist";
import { Text, Theme, View } from "tamagui";

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
    <Theme name={colorScheme}>
      <Stack.Screen
        options={{
          title: `Order #${orderId}`,
        }}
      />

      <View {...styles.container}>
        <OrderListItem order={order} hoverStyle={{ cursor: "default" }} />

        <AnimatedFlatList
          data={order.order_items}
          renderItem={({ item, index, scrollY }) => (
            <OrderItemListItem item={item} index={index} scrollY={scrollY} />
          )}
          contentContainerStyle={{ gap: 5, padding: 10 }}
        />
        <OrderStatusSelector activeStatus={order.status} orderId={id} />
      </View>
    </Theme>
  );
}

const styles = {
  container: {
    backgroundColor: "$background",
    paddingTop: 10,
    flex: 1,
    gap: 5,
  },
};
