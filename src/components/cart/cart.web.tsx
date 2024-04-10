import { FlatList, Platform, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/reduxStore";
import CartListItem from "../CartListItem";
import Button from "../Button";
import { clearCart, getCartTotal } from "../../lib/features/cartSlice";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useInsertOrder, useUpdateOrder } from "../../app/api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../../app/api/order-items";
import { CartItem, Tables, UpdateTables } from "../../lib/types";
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
import { toast } from "@backpackapp-io/react-native-toast";
import { ToastOptions } from "@/lib/constants/ToastOptions";

export default function Cart() {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const [isCheckout, setIsCheckout] = useState(false);

  useEffect(() => {
    dispatch(getCartTotal());
  }, [items]);

  const checkout = () => {
    if (items.length > 0) {
      setIsCheckout(true);
    } else {
      toast.error(
        "Please add a product to you cart first",
        ToastOptions({ iconName: "exclamation", iconColor: "red" }),
      );
    }
  };

  return (
    <Theme name={colorScheme}>
      {Platform.OS === "web" && <Header />}

      <ScrollView {...styles.container}>
        {!isCheckout && (
          <FlatList
            data={items}
            renderItem={({ item }) => <CartListItem cartItem={item} />}
            contentContainerStyle={{ gap: 5, padding: 10 }}
            style={{
              width: "90%",
              maxWidth: 800,
              // @ts-ignore: only available on Web
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
  const { profile } = useSelector((state: RootState) => state.auth);
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const { mutate: updateOrder } = useUpdateOrder();
  const router = useRouter();
  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();

  const cancelCheckout = () => {
    setIsCheckout(false);
  };

  const cancelOrder = (orderId: number) => {
    updateOrder({
      id: orderId,
      updatedFields: {
        status: "Cancelled",
      },
    });
  };

  const checkout = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const saveOrderItems = async (order: Tables<"orders"> | null) => {
      if (!order) return;
      if (!stripe || !elements) {
        cancelOrder(order.id);
        return;
      }

      const orderItems = items.map((cartItem) => ({
        order_id: order?.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        size: cartItem.size,
      }));

      insertOrderItems(orderItems, { onError: () => cancelOrder(order.id) });

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret,
        confirmParams: {
          return_url: `${process.env.EXPO_PUBLIC_WEBSITE_URL ?? "http://localhost:8081"}/user/orders/${order?.id}`,
        },
      });

      if (error) {
        cancelOrder(order.id);
        toast.error(
          "Error! Please try again later!",
          ToastOptions({ iconName: "exclamation", iconColor: "red" }),
        );
      }

      dispatch(clearCart());
      setIsCheckout(false);
      router.replace(`/user/orders/${order?.id}`);
    };

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) return;

    const { paymentIntent: clientSecret } = await fetchPaymentSheetParams(
      Math.round(total * 100),
      "usd",
    );

    if (!clientSecret) {
      toast.error(
        "Error! Please try again later!",
        ToastOptions({ iconName: "exclamation", iconColor: "red" }),
      );
      return;
    }

    const addressElement = elements.getElement("address");
    if (!addressElement) return;

    const { complete, value } = await addressElement.getValue();

    if (complete) {
      const orderToInsert: {
        total: number;
        user_name: string;
        address: string;
        country: string;
        city: string;
        postal_code: string;
        phone?: string;
      } = {
        total,
        user_name: value.name,
        address: value.address.line1,
        country: value.address.country,
        city: value.address.city,
        postal_code: value.address.postal_code,
      };
      if (value.phone) {
        orderToInsert.phone = value.phone;
      }
      insertOrder(orderToInsert, {
        onSuccess: saveOrderItems,
      });
    }
  };
  if (!profile) return;

  return (
    <View {...styles.cartForm}>
      <View {...styles.paymentSheetGroup}>
        <Text color="$color">Shipping Details:</Text>
        <AddressElement
          options={{
            mode: "shipping",
            fields: { phone: "always" },
            defaultValues: {
              name: profile.username,
              address: {
                country: profile.country?.substring(0, 2),
                line1: profile.address,
                city: profile.city,
                postal_code: profile.postal_code,
              },
              phone: profile.phone,
            },
          }}
        />
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
      <Button
        text="Cancel Order"
        onPress={cancelCheckout}
        backgroundColor="$red8"
      />
    </View>
  );
}

interface StyleTypes {
  container: GetProps<typeof ScrollView>;
  cartResults: GetProps<typeof View>;
  checkoutButton: GetProps<typeof Button>;
  cartForm: GetProps<typeof View>;
  paymentSheetGroup: GetProps<typeof View>;
}

const styles: StyleTypes = {
  container: {
    contentContainerStyle: {
      minHeight: "100%",
      alignItems: "center",
      backgroundColor: "$background",
      padding: 20,
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
  },
  paymentSheetGroup: {
    gap: "$3",
    marginBottom: "$4",
  },
};
