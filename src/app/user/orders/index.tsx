import OrderListItem from "@/components/OrderListItem";
import { Platform, useColorScheme } from "react-native";
import { useUserOrderList } from "../../api/orders";
import { useRealtimeUserOrders } from "@/lib/hooks/useSupabaseRealtime";
import Header from "@/components/webOnlyComponents/Header";
import { setIsLoading } from "@/lib/features/appSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import AnimatedFlatList from "@/components/AnimatedFlatlist";
import { Text, Theme, View } from "tamagui";

export default function OrdersPage() {
  const colorScheme = useColorScheme();
  const { data: orders, isLoading, error } = useUserOrderList();
  useRealtimeUserOrders();

  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading(true));
    } else {
      dispatch(setIsLoading(false));
    }
  }, [isLoading, dispatch]);

  if (error) {
    return <Text>Orders Not Found</Text>;
  }

  return (
    <Theme name={colorScheme}>
      {Platform.OS === "web" && <Header />}

      <View {...styles.container}>
        <AnimatedFlatList
          data={orders}
          renderItem={({ item, index, scrollY }) => (
            <OrderListItem order={item} index={index} scrollY={scrollY} />
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
    backgroundColor: "$background",
  },
};
