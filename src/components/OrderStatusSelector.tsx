import { OrderStatusList } from "../lib/types";
import { useUpdateOrder } from "../app/api/orders";
import { Button, Text, View } from "tamagui";

interface OrderStatusSelectorProps {
  activeStatus: string;
  orderId: number;
}

export default function OrderStatusSelector({
  activeStatus,
  orderId,
}: OrderStatusSelectorProps) {
  const { mutate: updateOrder } = useUpdateOrder();

  const updateOrderStatus = (status: string) => {
    updateOrder({
      id: orderId,
      updatedFields: {
        status: status,
      },
    });
  };

  return (
    <View flexDirection="row" gap={5} justifyContent="center">
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
          marginVertical={10}
          backgroundColor={activeStatus === status ? "$blue10" : "transparent"}
        >
          <Text color={activeStatus === status ? "white" : "$blue10"}>
            {status}
          </Text>
        </Button>
      ))}
    </View>
  );
}
