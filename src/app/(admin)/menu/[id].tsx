import { Link, Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/lib/constants/Colors";
import { useProduct } from "../../api/products";
import RemoteImage from "@/components/RemoteImage";
import { defaultPizzaImage } from "@assets/data/products";

export default function ProductDetailsScreen() {
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
  );
  const { data: product, error, isLoading } = useProduct(id);
  const colorScheme = useColorScheme();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <Stack.Screen
        options={{
          title: product?.name,
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <RemoteImage
        path={product?.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />

      <Text
        style={[styles.price, { color: Colors[colorScheme ?? "light"].text }]}
      >
        Price: ${product?.price}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  image: {
    width: "100%",
    aspectRatio: 1.5,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
  },
});
