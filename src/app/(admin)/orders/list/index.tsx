import OrderListItem from "@/src/components/OrderListItem";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAdminOrderList } from "@/src/app/api/orders";
import { useRealtimeAdminOrders } from "@/src/lib/hooks/useSupabaseRealtime";

export default function OrdersPage() {
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: false });

  useRealtimeAdminOrders();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch orders</Text>;
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
