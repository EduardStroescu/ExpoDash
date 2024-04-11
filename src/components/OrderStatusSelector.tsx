import { Platform } from "react-native";
import { Button, ScrollView, Text, View, useWindowDimensions } from "tamagui";
import { useUpdateOrder } from "../app/api/orders";
import { OrderStatusList } from "../lib/types";

interface OrderStatusSelectorProps {
  activeStatus: string;
  orderId: number;
}

export default function OrderStatusSelector({
  activeStatus,
  orderId,
}: OrderStatusSelectorProps) {
  const { mutate: updateOrder } = useUpdateOrder();
  const { width } = useWindowDimensions();

  const updateOrderStatus = (status: string) => {
    updateOrder({
      id: orderId,
      updatedFields: {
        status: status,
      },
    });
  };

  return (
    <ScrollView
      horizontal
      width="100%"
      contentContainerStyle={{
        width: width <= 472 ? "auto" : "100%",
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === "web" ? 0 : 10,
        alignItems: "center",
        justifyContent: width <= 472 ? "flex-start" : "center",
      }}
    >
      <View flexDirection="row" gap={5}>
        {OrderStatusList.map((status) => (
          <Button
            unstyled
            hoverStyle={{ cursor: "pointer" }}
            key={status}
            onPress={() => updateOrderStatus(status)}
            borderColor="$blue10"
            borderWidth={1}
            padding={10}
            borderRadius={5}
            backgroundColor={
              activeStatus === status ? "$blue10" : "transparent"
            }
          >
            <Text color={activeStatus === status ? "white" : "$blue10"}>
              {status}
            </Text>
          </Button>
        ))}
      </View>
    </ScrollView>
  );
}
