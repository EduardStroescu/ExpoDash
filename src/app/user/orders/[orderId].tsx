import { useColorScheme } from "react-native";
import { useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import { useOrderDetails } from "../../api/orders";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import AnimatedFlatList from "@/components/AnimatedFlatlist";
import { Theme, View } from "tamagui";
import PageError from "@/components/PageError";

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
    return <PageError />;
  }

  return (
    <Theme name={colorScheme}>
      <Stack.Screen
        options={{
          title: `Order #${orderId}`,
        }}
      />

      <View {...styles.container}>
        <OrderListItem order={order} />

        <AnimatedFlatList
          data={order.order_items}
          renderItem={({ item, index, scrollY }) => (
            <OrderItemListItem item={item} index={index} scrollY={scrollY} />
          )}
          contentContainerStyle={{ gap: 5, padding: 10 }}
        />
      </View>
    </Theme>
  );
}

const styles = {
  container: {
    flex: 1,
    gap: 10,
    backgroundColor: "$background",
  },
};
