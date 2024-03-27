import OrderListItem from "@/components/OrderListItem";
import { Platform, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useAdminOrderList } from "@/app/api/orders";
import Colors from "@/lib/constants/Colors";
import Header from "@/components/webOnlyComponents/Header";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import { useEffect } from "react";
import AnimatedFlatList from "@/components/AnimatedFlatlist";

export default function OrdersPage() {
  const colorScheme = useColorScheme();
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: true });

  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading(true));
    } else {
      dispatch(setIsLoading(false));
    }
  }, [isLoading, dispatch]);

  if (error) {
    return <Text>Failed to fetch archived orders</Text>;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      {Platform.OS === "web" && <Header />}
      <AnimatedFlatList
        data={orders}
        renderItem={({ item, index, scrollY }) => (
          <OrderListItem order={item} index={index} scrollY={scrollY} />
        )}
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
