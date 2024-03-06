import { StatusBar } from "expo-status-bar";
import { Alert, FlatList, Platform, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxStore";
import CartListItem from "../components/CartListItem";
import Button from "../components/Button";
import { clearCart, getCartTotal } from "../lib/features/cartSlice";
import { useEffect } from "react";
import Colors from "../lib/constants/Colors";
import { useInsertOrder } from "./api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "./api/order-items";
import { Tables } from "../lib/types";

export default function CartScreen() {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const router = useRouter();

  useEffect(() => {
    dispatch(getCartTotal());
  }, [items]);

  const checkout = async () => {
    const saveOrderItems = async (order: Tables<"orders"> | null) => {
      if (!order) return;
      const orderItems = items.map((cartItem) => ({
        order_id: order?.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        size: cartItem.size,
      }));

      insertOrderItems(orderItems, {
        onSuccess() {
          dispatch(clearCart());
          router.replace(`/(user)/orders/${order?.id}`);
        },
      });
    };

    Alert.alert("Confirm", "Send your order as it is?", [
      {
        text: "Cancel",
      },
      {
        text: "Continue",
        style: "default",
        onPress: () => {
          insertOrder(
            { total },
            {
              onSuccess: saveOrderItems,
            }
          );
        },
      },
    ]);
  };

  return (
    <View style={{ height: "100%" }}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ width: "100%", gap: 10, padding: 10 }}
      />
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ alignSelf: "center", fontSize: 20 }}>
          Total:{" "}
          <Text style={{ fontWeight: "bold", color: Colors.light.tint }}>
            ${total}
          </Text>
        </Text>
        <Button text="Go to checkout" onPress={checkout} />
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
