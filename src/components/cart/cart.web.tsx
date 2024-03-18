import { FlatList, ScrollView, Text, View, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/reduxStore";
import CartListItem from "../CartListItem";
import Button from "../Button";
import { clearCart, getCartTotal } from "../../lib/features/cartSlice";
import { useEffect, useState } from "react";
import Colors from "../../lib/constants/Colors";
import { useInsertOrder } from "../../app/api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../../app/api/order-items";
import { CartItem, Tables } from "../../lib/types";
import {
  AddressElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  fetchPaymentSheetParams,
  stripePromise,
} from "@/lib/stripe/stripe.web";

export default function Cart() {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const [isCheckout, setIsCheckout] = useState(false);

  useEffect(() => {
    dispatch(getCartTotal());
  }, [items]);

  const checkout = () => {
    setIsCheckout(true);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ flex: 1, gap: 10, padding: 10 }}
        style={{ width: "50%" }}
      />
      {isCheckout && (
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: Math.floor(total * 100),
            currency: "usd",
            appearance: {
              theme: "night",
              labels: "floating",
            },
          }}
        >
          <CheckoutForm total={total} items={items} />
        </Elements>
      )}
      {!isCheckout && (
        <View style={{ width: "50%", paddingHorizontal: 10 }}>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 20,
              color: Colors[colorScheme ?? "light"].text,
            }}
          >
            Total:{" "}
            <Text
              style={{
                fontWeight: "bold",
                color: Colors[colorScheme ?? "light"].tint,
              }}
            >
              ${total}
            </Text>
          </Text>
          <Button text="Go to checkout" onPress={checkout} />
        </View>
      )}
    </ScrollView>
  );
}

function CheckoutForm({ total, items }: { total: number; items: CartItem[] }) {
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const router = useRouter();
  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();

  const colorScheme = useColorScheme();

  const checkout = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const saveOrderItems = async (order: Tables<"orders"> | null) => {
      if (!stripe || !elements || !order) {
        return;
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        // Show error to your customer
        return;
      }

      const { paymentIntent: clientSecret } = await fetchPaymentSheetParams(
        Math.floor(total * 100),
        "usd"
      );

      if (!clientSecret) return;

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret,
        confirmParams: {
          return_url: `http://localhost:8081/orders/${order?.id}`,
        },
      });

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

    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      }
    );
  };
  return (
    <View style={{ width: "50%", marginTop: 50 }}>
      <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
        Shipping Details:
      </Text>
      <AddressElement options={{ mode: "shipping" }} />
      <Text style={{ color: Colors[colorScheme ?? "light"].text }}>
        Payment
      </Text>
      <PaymentElement />
      <Button text="Pay" disabled={!stripe || !elements} onPress={checkout} />
    </View>
  );
}
