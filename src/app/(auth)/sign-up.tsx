import Button from "@/components/Button";
import Input, { InputProps } from "@/components/Input";
import Meta from "@/components/Meta";
import { ToastOptions } from "@/lib/constants/ToastOptions";
import { SignUpSchema } from "@/lib/formSchemas/signUpSchema";
import { supabase } from "@/lib/supabase/supabase";
import { toast } from "@backpackapp-io/react-native-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, useColorScheme } from "react-native";
import {
  Form,
  GetProps,
  ScrollView,
  Text,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import { z } from "zod";

export default function SignUpPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof SignUpSchema>> = async ({
    email,
    password,
  }) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast(
        error.message,
        ToastOptions({ iconName: "exclamation", iconColor: "red" }),
      );
      setLoading(false);
      return;
    }
    setLoading(false);
    reset();
    router.replace("/");
  };

  return (
    <Theme name={colorScheme}>
      {Platform.OS === "web" && <Meta />}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView {...styles.page}>
          <Text {...styles.title}>Register</Text>
          <Form {...styles.form} id="box-shadow" gap="$3">
            <YStack gap="$2">
              <Text {...styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    {...styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="johnDoe@gmail.com"
                    clearButtonMode="while-editing"
                    autoCorrect={false}
                    returnKeyType="done"
                  />
                )}
              />
              {errors.email && (
                <Text {...styles.errorMessage}>{errors.email.message}</Text>
              )}
            </YStack>

            <YStack gap="$2">
              <Text {...styles.label}>Password</Text>
              <Controller
                control={control}
                rules={{
                  required: "Password is required",
                }}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <Input
                    {...styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder=""
                    clearButtonMode="while-editing"
                    textContentType="password"
                    secureTextEntry
                    autoCorrect={false}
                    returnKeyType="done"
                  />
                )}
              />
              {errors.password && (
                <Text {...styles.errorMessage}>{errors.password.message}</Text>
              )}
            </YStack>

            <Button
              text={loading ? "Creating Account..." : "Create an account"}
              disabled={loading}
              onPress={handleSubmit(onSubmit)}
              marginTop="$4"
            />
            <XStack
              marginTop={20}
              alignSelf="center"
              gap="$2"
              alignItems="center"
            >
              <Text fontSize={13} fontWeight="unset">
                Already have an account?
              </Text>
              <Link href="/sign-in" asChild>
                <Text {...styles.link}>Sign In</Text>
              </Link>
            </XStack>
          </Form>
        </ScrollView>
      </KeyboardAvoidingView>
    </Theme>
  );
}

interface StyleTypes {
  page: GetProps<typeof ScrollView>;
  form: GetProps<typeof Form>;
  title: GetProps<typeof Text>;
  label: GetProps<typeof Text>;
  input: InputProps;
  link: GetProps<typeof Text>;
  errorMessage: GetProps<typeof Text>;
}

const styles: StyleTypes = {
  page: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: "$background",
    contentContainerStyle: {
      height: "90%",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  // @ts-ignore: onSubmit is not required to function, but added form for the ability to sumbit on pressing "enter" on web
  form: {
    paddingHorizontal: 20,
    alignSelf: "center",
    width: "100%",
    $gtSm: {
      width: "40%",
      minWidth: 400,
      maxWidth: 500,
      paddingVertical: 20,
      borderRadius: 20,
      borderStyle: "double" as "solid",
      borderWidth: 4,
      borderColor: "#7007acff",
      position: "relative",
      zIndex: -1,
      backgroundColor: "#0c1033b2",
    },
  },
  title: {
    fontSize: 60,
    alignSelf: "center",
    color: "$blue10",
    marginBottom: 20,
  },
  label: { fontSize: 16, color: "$color10" },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  link: {
    fontWeight: "bold",
    color: "$blue10",
    hoverStyle: { cursor: "pointer", color: "$blue11" },
  },
  errorMessage: {
    fontSize: 14,
    color: "red",
  },
};
