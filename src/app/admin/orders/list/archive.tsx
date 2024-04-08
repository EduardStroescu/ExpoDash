import { Platform, useColorScheme } from "react-native";
import { useAdminOrderList } from "@/app/api/orders";
import Header from "@/components/webOnlyComponents/Header";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import { useEffect } from "react";
import AnimatedFlatList from "@/components/AnimatedFlatlist";
import { Theme, View } from "tamagui";
import PageError from "@/components/PageError";
import AnimatedOrderListItem from "@/components/AnimatedOrderListItem";

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
