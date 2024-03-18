import { StripeProvider } from "@stripe/stripe-react-native";
import { ReactElement } from "react";

interface StripeProviderProps {
  children: ReactElement;
}

export default function StripePlatformProvider({
  children,
}: StripeProviderProps) {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
    >
      {children}
    </StripeProvider>
  );
}
