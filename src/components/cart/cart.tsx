import { StatusBar } from "expo-status-bar";
import { Alert, FlatList, Platform, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/reduxStore";
import CartListItem from "../CartListItem";
import Button from "../Button";
import { clearCart, getCartTotal } from "../../lib/features/cartSlice";
import { useEffect } from "react";
import Colors from "../../lib/constants/Colors";
import { useInsertOrder } from "../../app/api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../../app/api/order-items";
import { Tables } from "../../lib/types";
import {
  initialisePaymentSheet,
  openPaymentSheet,
} from "../../lib/stripe/stripe";
import { Text, Theme, View } from "tamagui";
import { InlineGradient } from "../InlineGradient";

export default function Cart() {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    dispatch(getCartTotal());
  }, [items]);

  const checkout = async () => {
    const saveOrderItems = async (order: Tables<"orders"> | null) => {
      await initialisePaymentSheet(Math.round(total * 100), "usd");
      const payed = await openPaymentSheet();
      if (!payed) {
        return;
      }

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
            },
          );
        },
      },
    ]);
  };

  return (
    <Theme name={colorScheme}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      <View {...styles.container}>
        <FlatList
          data={items}
          renderItem={({ item }) => <CartListItem cartItem={item} />}
          contentContainerStyle={{ width: "100%", gap: 10, padding: 10 }}
        />
        <View {...styles.cartResults}>
          <InlineGradient />
          <Text
            style={{
              alignSelf: "center",
              fontSize: 20,
              color: "white",
            }}
          >
            Total:{" "}
            <Text
              style={{
                fontWeight: "bold",
                color: Colors[colorScheme ?? "light"].tint,
              }}
            >
              ${total.toFixed(2)}
            </Text>
          </Text>
        </View>
        <Button
          text="Go to checkout"
          onPress={checkout}
          marginHorizontal={10}
        />
      </View>
    </Theme>
  );
}

const styles = {
  container: {
    height: "100%",
    paddingBottom: 20,
    gap: "$4",
    backgroundColor: "$background",
  },
  cartResults: {
    position: "relative",
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cartTotal: {
    fontSize: 20,
    color: "$blue10",
  },
};
