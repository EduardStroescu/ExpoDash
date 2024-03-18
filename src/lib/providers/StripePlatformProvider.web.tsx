import { ReactElement } from "react";

interface StripeProviderProps {
  children: ReactElement;
}

export default function StripePlatformProvider({
  children,
}: StripeProviderProps) {
  return <>{children}</>;
}
