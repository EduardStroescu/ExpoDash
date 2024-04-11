import AnimatedFlatList from "@/components/AnimatedFlatlist";
import AnimatedOrderListItem from "@/components/AnimatedOrderListItem";
import PageError from "@/components/PageError";
import Header from "@/components/webOnlyComponents/Header";
import { useRealtimeUserOrders } from "@/lib/hooks/useSupabaseRealtime";
import { Platform, useColorScheme } from "react-native";
import { Theme, View } from "tamagui";
import { useUserOrderList } from "../../api/orders";

export default function OrdersPage() {
  const colorScheme = useColorScheme();
  const { data: orders, isLoading, error } = useUserOrderList();
  useRealtimeUserOrders();

  if (error) {
    return <PageError />;
  }

  return (
    <Theme name={colorScheme}>
      {Platform.OS === "web" && <Header />}

      <View {...styles.container}>
        <AnimatedFlatList
          data={orders}
          renderItem={({ item, index, scrollY }) => (
            <AnimatedOrderListItem
              order={item}
              index={index}
              scrollY={scrollY}
            />
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
