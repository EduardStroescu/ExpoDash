import { supabase } from "../supabase/supabase";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

const fetchPaymentSheetParams = async (amount: number, currency: string) => {
  const { data, error } = await supabase.functions.invoke("payment-sheet", {
    body: { amount: amount, currency: currency },
  });

  if (data) {
    return data;
  } else {
    return {};
  }
};

export const initialisePaymentSheet = async (
  amount: number,
  currency: string,
  name: string = "John Doe",
) => {
  const { paymentIntent, publishableKey } = await fetchPaymentSheetParams(
    amount,
    currency,
  );

  if (!paymentIntent || !publishableKey) return;

  await initPaymentSheet({
    merchantDisplayName: "ExpoDash",
    paymentIntentClientSecret: paymentIntent,
    returnURL: "your-app://stripe-redirect",
    defaultBillingDetails: {
      name: name,
    },
  });
};

export const openPaymentSheet = async () => {
  const { error } = await presentPaymentSheet();

  if (error) {
    return false;
  }
  return true;
};
