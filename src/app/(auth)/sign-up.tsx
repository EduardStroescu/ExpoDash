import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import Button from "@/src/components/Button";
import { Link, router } from "expo-router";
import Colors from "@/src/lib/constants/Colors";
import { supabase } from "@/src/lib/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const signUpWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
      return;
    }
    setLoading(false);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="johnDoe@gmail.com"
        clearButtonMode="while-editing"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder=""
        clearButtonMode="while-editing"
        textContentType="password"
        secureTextEntry
        autoCorrect={false}
      />

      <Button
        text={loading ? "Creating Account..." : "Create an account"}
        disabled={loading}
        onPress={signUpWithEmail}
      />
      <Link href="/sign-up" style={styles.link}>
        Sign In
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  label: { color: "grey", fontSize: 16 },
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
    color: Colors.light.tint,
    marginVertical: 10,
  },
});
