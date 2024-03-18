import {
  Text,
  TextInput,
  StyleSheet,
  Alert,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useState } from "react";
import Button from "@/components/Button";
import { Link, router } from "expo-router";
import Colors from "@/lib/constants/Colors";
import { supabase } from "@/lib/supabase/supabase";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpSchema = z.object({
  email: z
    .string({ required_error: "E-mail is required." })
    .email({ message: "Invalid E-mail address" }),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, { message: "Password must contain at least 8 characters." }),
});

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
      Alert.alert(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    reset();
    router.replace("/");
  };

  return (
    <ScrollView style={styles.container}>
      <Text
        style={[styles.title, { color: Colors[colorScheme ?? "light"].tint }]}
      >
        Welcome!
      </Text>
      <Text
        style={[
          styles.label,
          { color: Colors[colorScheme ?? "light"].subText },
        ]}
      >
        Email
      </Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            style={styles.input}
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
        <Text style={styles.errorMessage}>{errors.email.message}</Text>
      )}

      <Text
        style={[
          styles.label,
          { color: Colors[colorScheme ?? "light"].subText },
        ]}
      >
        Password
      </Text>
      <Controller
        control={control}
        rules={{
          required: "Password is required",
        }}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
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
        <Text style={styles.errorMessage}>{errors.password.message}</Text>
      )}

      <Button
        text={loading ? "Creating Account..." : "Create an account"}
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
      />
      <Link
        href="/sign-in"
        style={[styles.link, { color: Colors[colorScheme ?? "light"].tint }]}
      >
        Sign In
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 60, alignSelf: "center", marginVertical: 40 },
  label: { fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  link: {
    alignSelf: "center",
    fontWeight: "bold",
    marginVertical: 10,
  },
  errorMessage: {
    color: "red",
  },
});
