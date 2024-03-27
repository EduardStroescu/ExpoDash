import { Pressable, Text, View, useColorScheme } from "react-native";
import { OrderStatusList } from "../lib/types";
import Colors from "../lib/constants/Colors";
import { useUpdateOrder } from "../app/api/orders";

interface OrderStatusSelectorProps {
  activeStatus: string;
  orderId: number;
}

export default function OrderStatusSelector({
  activeStatus,
  orderId,
}: OrderStatusSelectorProps) {
  const colorScheme = useColorScheme();
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
    <>
      <View style={{ flexDirection: "row", gap: 5, justifyContent: "center" }}>
        {OrderStatusList.map((status) => (
          <Pressable
            key={status}
            onPress={() => updateOrderStatus(status)}
            style={{
              borderColor: Colors.light.tint,
              borderWidth: 1,
              padding: 10,
              borderRadius: 5,
              marginVertical: 10,
              backgroundColor:
                activeStatus === status ? Colors.light.tint : "transparent",
            }}
          >
            <Text
              style={{
                color:
                  activeStatus === status
                    ? "white"
                    : Colors[colorScheme ?? "light"].tint,
              }}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}
