import { Alert, useColorScheme, Platform } from "react-native";
import { useState } from "react";
import Button from "@/components/Button";
import { Link, router } from "expo-router";
import { supabase } from "@/lib/supabase/supabase";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Meta from "@/components/Meta";
import { Form, ScrollView, Text, Theme } from "tamagui";
import Input, { InputProps } from "@/components/Input";
import { LogInAsDemoAccount } from "@/components/LogInAsDemoAccount";

const SignInSchema = z.object({
  email: z
    .string({ required_error: "E-mail is required." })
    .email({ message: "Invalid E-mail address" }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Password must contain at least 8 characters." }),
});

export default function SignInPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof SignInSchema>> = async ({
    email,
    password,
  }) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
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

      <ScrollView {...styles.container}>
        <Form {...styles.form}>
          <Text {...styles.title}>Sign In</Text>
          <Text {...styles.label}>Email</Text>
          <Controller
            control={control}
            rules={{
              required: "E-Mail is required",
            }}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="johnDoe@gmail.com"
                placeholderTextColor="grey"
                clearButtonMode="while-editing"
                autoCorrect={false}
                returnKeyType="done"
              />
            )}
          />
          {errors.email && (
            <Text {...styles.errorMessage}>{errors.email.message}</Text>
          )}

          <Text {...styles.label}>Password</Text>
          <Controller
            control={control}
            rules={{
              required: "Password is required",
            }}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                style={styles.input}
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

          <Button
            text={loading ? "Signing in..." : "Sign In"}
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
          />
          <Link asChild href="/sign-up">
            <Text {...styles.link}>Create an Account</Text>
          </Link>
          <LogInAsDemoAccount loading={loading} setLoading={setLoading} />
        </Form>
      </ScrollView>
    </Theme>
  );
}

interface StyleProps {
  container: React.ComponentPropsWithoutRef<typeof ScrollView>;
  form: React.ComponentPropsWithoutRef<typeof Form>;
  title: React.ComponentPropsWithoutRef<typeof Text>;
  label: React.ComponentPropsWithoutRef<typeof Text>;
  input: InputProps;
  link: React.ComponentPropsWithoutRef<typeof Text>;
  errorMessage: React.ComponentPropsWithoutRef<typeof Text>;
}

const styles: StyleProps = {
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "$background",
    contentContainerStyle: { justifyContent: "center" },
  },
  form: {
    padding: 20,
    alignSelf: "center",
    width: "100%",
    $gtMd: { width: "30%" },
  },
  title: {
    fontSize: 60,
    alignSelf: "center",
    marginVertical: 40,
    color: "$blue10",
  },
  label: { fontSize: 16, color: "$color10" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    borderRadius: 5,
  },
  link: {
    alignSelf: "center",
    marginVertical: 20,
    fontWeight: "bold",
    color: "$blue10",
    hoverStyle: { cursor: "pointer" },
  },
  errorMessage: {
    color: "red",
  },
};
