import { StatusBar } from "expo-status-bar";
import { Alert, FlatList, Platform, useColorScheme } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/reduxStore";
import CartListItem from "../CartListItem";
import Button from "../Button";
import { clearCart, getCartTotal } from "../../lib/features/cartSlice";
import { useEffect, useState } from "react";
import { useInsertOrder, useUpdateOrder } from "../../app/api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../../app/api/order-items";
import { Tables } from "../../lib/types";
import {
  initialisePaymentSheet,
  openPaymentSheet,
} from "../../lib/stripe/stripe";
import { GetProps, Text, Theme, View } from "tamagui";
import { InlineGradient } from "../InlineGradient";
import { toast } from "@backpackapp-io/react-native-toast";
import { ToastOptions } from "@/lib/constants/ToastOptions";
import { AddressDetails, AddressSheet } from "@stripe/stripe-react-native";

export default function Cart() {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const { mutate: updateOrder } = useUpdateOrder();
  const { profile } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [addressSheetVisible, setAddressSheetVisible] = useState(false);

  useEffect(() => {
    dispatch(getCartTotal());
  }, [items]);

  const cancelOrder = (orderId: number) => {
    updateOrder({
      id: orderId,
      updatedFields: {
        status: "Cancelled",
      },
    });
  };

  const checkout = async (addressDetails: AddressDetails) => {
    const saveOrderItems = async (order: Tables<"orders"> | null) => {
      if (!profile || !profile.username) return;
      await initialisePaymentSheet(
        Math.round(total * 100),
        "usd",
        profile.username,
      );

      const payed = await openPaymentSheet();

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
          router.replace(`/user/orders/${order?.id}`);
        },
        onError() {
          cancelOrder(order.id);
          toast.error(
            "There was an error processing the order. Please try again later!",
            ToastOptions({ iconName: "exclamation", iconColor: "red" }),
          );
        },
      });

      if (!payed) {
        cancelOrder(order.id);
        toast.error(
          "Error! Please try again later!",
          ToastOptions({ iconName: "exclamation", iconColor: "red" }),
        );
        router.replace("/user/menu/");
        return;
      }
    };

    setAddressSheetVisible(false);
    if (!addressDetails) return;
    const orderToInsert: {
      total: number;
      user_name: string | undefined;
      address: string | undefined;
      country: string | undefined;
      city: string | undefined;
      postal_code: string | undefined;
      phone?: string;
    } = {
      total,
      user_name: addressDetails.name,
      address: addressDetails.address?.line1,
      country: addressDetails.address?.country,
      city: addressDetails.address?.city,
      postal_code: addressDetails.address?.postalCode,
    };

    if (addressDetails.phone) {
      orderToInsert.phone = addressDetails.phone;
    }
    insertOrder(orderToInsert, {
      onSuccess: saveOrderItems,
    });
  };

  const startCheckoutProcess = () => {
    Alert.alert("Confirm", "Send your order as it is?", [
      {
        text: "Cancel",
      },
      {
        text: "Continue",
        style: "default",
        onPress: () => {
          setAddressSheetVisible(true);
        },
      },
    ]);
  };

  return (
    <Theme name={colorScheme}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <AddressSheet
        visible={addressSheetVisible}
        onSubmit={checkout}
        onError={() =>
          toast.error(
            "There has been an error with the payment process. Please try again later.",
            ToastOptions({ iconName: "exclamation", iconColor: "red" }),
          )
        }
        additionalFields={{ phoneNumber: "required" }}
        defaultValues={(() => {
          if (!profile) return undefined;
          return {
            name: profile.username,
            address: {
              country: profile.country?.substring(0, 2).toUpperCase(),
              line1: profile.address,
              city: profile.city,
              postalCode: profile.postal_code,
            },
            phone: profile.phone,
          } as AddressDetails;
        })()}
      />

      <View {...styles.container}>
        <FlatList
          data={items}
          renderItem={({ item }) => <CartListItem cartItem={item} />}
          contentContainerStyle={{ width: "100%", gap: 10, padding: 10 }}
        />
        <View {...styles.cartResults}>
          <InlineGradient />
          <Text alignSelf="center" fontSize={20} color="white">
            Total:{" "}
            <Text fontWeight="bold" color="$blue10">
              ${total.toFixed(2)}
            </Text>
          </Text>
        </View>
        <Button
          text="Go to checkout"
          onPress={startCheckoutProcess}
          marginHorizontal={10}
        />
      </View>
    </Theme>
  );
}

interface StyleTypes {
  container: GetProps<typeof View>;
  cartResults: GetProps<typeof View>;
  cartTotal: GetProps<typeof Text>;
}

const styles: StyleTypes = {
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
