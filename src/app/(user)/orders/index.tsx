import OrderListItem from "@/components/OrderListItem";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useUserOrderList } from "../../api/orders";
import { useRealtimeUserOrders } from "@/lib/hooks/useSupabaseRealtime";

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useUserOrderList();
  useRealtimeUserOrders();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Order Not Found</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ width: "100%", gap: 10, padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
