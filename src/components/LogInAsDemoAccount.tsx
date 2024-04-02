import { View } from "tamagui";
import Button, { ButtonProps } from "./Button";
import { Text } from "tamagui";
import { supabase } from "@/lib/supabase/supabase";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import React, { Dispatch, SetStateAction } from "react";

interface LogInAsDemoAccountProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export function LogInAsDemoAccount({
  loading,
  setLoading,
}: LogInAsDemoAccountProps) {
  const router = useRouter();

  const handleLogin = async (accountType: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email:
        accountType === "admin"
          ? process.env.EXPO_PUBLIC_ADMIN_DEMO_ACCOUNT_ID!
          : process.env.EXPO_PUBLIC_USER_DEMO_ACCOUNT_ID!,
      password:
        accountType === "admin"
          ? process.env.EXPO_PUBLIC_ADMIN_DEMO_ACCOUNT_PASS!
          : process.env.EXPO_PUBLIC_USER_DEMO_ACCOUNT_PASS!,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    router.replace("/");
  };

  return (
    <View {...styles.container}>
      <Text {...styles.text}>- OR -</Text>
      <Button
        text="Demo Admin Account"
        disabled={loading}
        {...styles.button}
        onPress={() => handleLogin("admin")}
      />
      <Button
        text="Demo User Account"
        disabled={loading}
        {...styles.button}
        onPress={() => handleLogin("user")}
      />
    </View>
  );
}

interface StyleProps {
  container: React.PropsWithoutRef<typeof View>;
  text: React.PropsWithoutRef<typeof Text>;
  button: ButtonProps;
}

const styles: StyleProps = {
  container: {
    gap: "$2",
  },
  text: { alignSelf: "center", marginBottom: 10 },
  button: { color: "$red10" },
};
