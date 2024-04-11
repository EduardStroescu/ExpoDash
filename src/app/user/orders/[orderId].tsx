import AnimatedFlatList from "@/components/AnimatedFlatlist";
import OrderIdOrderDetails from "@/components/OrderIdOrderDetails";
import OrderItemListItem from "@/components/OrderItemListItem";
import OrderListItem from "@/components/OrderListItem";
import PageError from "@/components/PageError";
import { setIsLoading } from "@/lib/features/appSlice";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useDispatch } from "react-redux";
import { Theme, View } from "tamagui";
import { useOrderDetails } from "../../api/orders";

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
        <View>
          <OrderListItem order={order} hoverStyle={{ cursor: "default" }} />
          <OrderIdOrderDetails order={order} />
        </View>

        <AnimatedFlatList
          data={order.order_items}
          renderItem={({ item, index, scrollY }) => (
            <OrderItemListItem item={item} index={index} scrollY={scrollY} />
          )}
          style={{ height: "100%" }}
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
