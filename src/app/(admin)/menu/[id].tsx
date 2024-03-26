import { Link, Stack, useLocalSearchParams } from "expo-router";
import {
  Platform,
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
import Header from "@/components/webOnlyComponents/Header";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import { useEffect } from "react";

export default function ProductDetailsScreen() {
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
  );
  const { data: product, error, isLoading } = useProduct(id);
  const colorScheme = useColorScheme();

  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading(true));
    } else {
      dispatch(setIsLoading(false));
    }
  }, [isLoading, dispatch]);

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={[
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

      {Platform.OS === "web" && <Header slug={id} />}

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
      <Text
        style={[
          styles.description,
          { color: Colors[colorScheme ?? "light"].text },
        ]}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam dolor ab
        officiis? Eaque quod unde optio architecto nostrum ipsum velit,
        excepturi distinctio error reprehenderit illo similique blanditiis harum
        vel! Quibusdam. Libero numquam nemo consequuntur quia temporibus porro
        et corrupti aliquam, ducimus, illo excepturi sequi quos officiis!
        Commodi quisquam in corrupti debitis adipisci corporis hic ad.
        Consequatur doloremque accusantium nulla illum!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, justifyContent: "center" },
  image: {
    flex: 1,
    aspectRatio: 1,
    alignSelf: "center",
    objectFit: "contain",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
  },
  description: {
    marginTop: 20,
    alignSelf: "center",
    textAlign: "justify",
  },
});
