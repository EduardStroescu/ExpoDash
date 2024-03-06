import { RootState } from "@/src/reduxStore";
import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";

export default function AuthLayout() {
  const { session } = useSelector((state: RootState) => state.auth);

  if (session) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
    </Stack>
  );
}
