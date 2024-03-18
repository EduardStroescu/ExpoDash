import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "../supabase/supabase";

export const stripePromise = loadStripe(
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export const fetchPaymentSheetParams = async (
  amount: number,
  currency: string
) => {
  const { data, error } = await supabase.functions.invoke("payment-sheet", {
    body: { amount: amount, currency: currency },
  });
  if (data) {
    return data;
  } else {
    return {};
  }
};
