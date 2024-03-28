import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Platform, Pressable, useColorScheme } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/lib/constants/Colors";
import { useProduct } from "../../api/products";
import RemoteImage from "@/components/RemoteImage";
import { defaultPizzaImage } from "@assets/data/products";
import Header from "@/components/webOnlyComponents/Header";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import { useEffect } from "react";
import { ScrollView, Text, Theme, YStack } from "tamagui";

export default function ProductDetailsScreen() {
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0],
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
    <Theme name={colorScheme}>
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

      <ScrollView {...styles.container}>
        <YStack $gtMd={{ width: "40%", alignSelf: "center" }}>
          <RemoteImage
            path={product?.image}
            fallback={defaultPizzaImage}
            style={{
              width: 500,
              height: 500,
              aspectRatio: 1,
              alignSelf: "center",
            }}
            resizeMode="contain"
          />

          <Text {...styles.price}>Price: ${product?.price}</Text>
          <Text {...styles.description}>{product?.description}</Text>
        </YStack>
      </ScrollView>
    </Theme>
  );
}

interface StyleProps {
  container: React.PropsWithoutRef<typeof ScrollView>;
  price: React.PropsWithoutRef<typeof Text>;
  size: React.PropsWithoutRef<typeof Pressable>;
  description: React.PropsWithoutRef<typeof Text>;
}

const styles: StyleProps = {
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "$background",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
    color: "$blue10",
  },
  description: {
    marginTop: 20,
    alignSelf: "center",
    textAlign: "justify",
    color: "$color",
  },
};
