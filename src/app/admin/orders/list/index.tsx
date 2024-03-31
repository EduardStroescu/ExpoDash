import OrderListItem from "@/components/OrderListItem";
import { Platform, useColorScheme } from "react-native";
import { useAdminOrderList } from "@/app/api/orders";
import { useRealtimeAdminOrders } from "@/lib/hooks/useSupabaseRealtime";
import Header from "@/components/webOnlyComponents/Header";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import { useEffect } from "react";
import AnimatedFlatList from "@/components/AnimatedFlatlist";
import { Text, Theme, View } from "tamagui";

export default function OrdersPage() {
  const colorScheme = useColorScheme();
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: false });

  useRealtimeAdminOrders();

  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading(true));
    } else {
      dispatch(setIsLoading(false));
    }
  }, [isLoading, dispatch]);

  if (error) {
    return <Text>Failed to fetch orders</Text>;
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
          contentContainerStyle={{ width: "100%", gap: 10, padding: 10 }}
        />
      </View>
    </Theme>
  );
}

const styles = {
  container: {
    height: "100%",
    backgroundColor: "$background",
  },
};
