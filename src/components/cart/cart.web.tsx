import { FlatList, Platform, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/reduxStore";
import CartListItem from "../CartListItem";
import Button from "../Button";
import { clearCart, getCartTotal } from "../../lib/features/cartSlice";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import Header from "../webOnlyComponents/Header";
import { GetProps, ScrollView, Text, Theme, View } from "tamagui";
import { InlineGradient } from "../InlineGradient";

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
    <Theme name={colorScheme}>
      <ScrollView {...styles.container}>
        {Platform.OS === "web" && <Header />}

        {!isCheckout && (
          <FlatList
            data={items}
            renderItem={({ item }) => <CartListItem cartItem={item} />}
            contentContainerStyle={{ gap: 5, padding: 10 }}
            style={{
              width: "90%",
              maxWidth: 800,
              overflowY: items.length > 0 ? "scroll" : "hidden",
              height: "50vh",
            }}
          />
        )}
        {!isCheckout && (
          <>
            <View {...styles.cartResults}>
              <InlineGradient />
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 20,
                  color: "$color",
                }}
              >
                Total:{" "}
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "$blue10",
                  }}
                >
                  ${total.toFixed(2)}
                </Text>
              </Text>
            </View>
            <Button
              text="Go to checkout"
              onPress={checkout}
              {...styles.checkoutButton}
            />
          </>
        )}
        {isCheckout && (
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: Math.round(total * 100),
              currency: "usd",
              appearance: {
                theme: "night",
                labels: "floating",
              },
            }}
          >
            <CheckoutForm
              total={total}
              items={items}
              setIsCheckout={setIsCheckout}
            />
          </Elements>
        )}
      </ScrollView>
    </Theme>
  );
}

function CheckoutForm({
  total,
  items,
  setIsCheckout,
}: {
  total: number;
  items: CartItem[];
  setIsCheckout: Dispatch<SetStateAction<boolean>>;
}) {
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const router = useRouter();
  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();

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
        Math.round(total * 100),
        "usd",
      );

      if (!clientSecret) return;

      const orderItems = items.map((cartItem) => ({
        order_id: order?.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        size: cartItem.size,
      }));

      insertOrderItems(orderItems);

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret,
        confirmParams: {
          return_url: `${process.env.EXPO_PUBLIC_WEBSITE_URL}/user/orders/${order?.id}`,
        },
      });

      dispatch(clearCart());
      setIsCheckout(false);
      router.replace(`/user/orders/${order?.id}`);
    };

    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      },
    );
  };
  return (
    <View {...styles.cartForm}>
      <View {...styles.paymentSheetGroup}>
        <Text color="$color">Shipping Details:</Text>
        <AddressElement options={{ mode: "shipping" }} />
      </View>
      <View {...styles.paymentSheetGroup}>
        <Text color="$color">Payment</Text>
        <PaymentElement />
      </View>
      <Button
        text={`Pay $${total.toFixed(2)}`}
        disabled={!stripe || !elements}
        onPress={checkout}
        width="100%"
      />
    </View>
  );
}

interface StyleProps {
  container: GetProps<typeof ScrollView>;
  cartResults: GetProps<typeof View>;
  checkoutButton: GetProps<typeof Button>;
  cartForm: GetProps<typeof View>;
  paymentSheetGroup: GetProps<typeof View>;
}

const styles: StyleProps = {
  container: {
    contentContainerStyle: {
      minHeight: "100%",
      alignItems: "center",
      backgroundColor: "$background",
      paddingBottom: 20,
      gap: "$4",
    },
  },
  cartResults: {
    position: "relative",
    width: "20%",
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  checkoutButton: {
    width: "30%",
  },
  cartForm: {
    width: "50%",
    gap: "$3",
    justifyContent: "center",
  },
  paymentSheetGroup: {
    gap: "$3",
    marginBottom: "$4",
  },
};
