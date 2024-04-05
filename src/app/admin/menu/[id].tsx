import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Platform, Pressable, useColorScheme } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/lib/constants/Colors";
import { useProduct } from "../../api/products";
import RemoteImage from "@/components/RemoteImage";
import { defaultPizzaImage } from "@assets/data/products";
import Header from "@/components/webOnlyComponents/Header";
import { GetProps, ScrollView, Text, Theme, YStack } from "tamagui";
import PageError from "@/components/PageError";

export default function ProductDetailsScreen() {
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0],
  );
  const { data: product, error, isLoading } = useProduct(id);
  const colorScheme = useColorScheme();

  if (error) {
    return <PageError />;
  }

  return (
    <Theme name={colorScheme}>
      <Stack.Screen
        options={{
          title: product?.name,
          headerRight: () => (
            <Link href={`/admin/menu/create?id=${id}`} asChild>
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
        <YStack
          $gtXs={{
            width: "60%",
            alignSelf: "center",
            justifyContent: "center",
          }}
          $gtMd={{
            width: "50%",
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <RemoteImage
            path={product?.image}
            fallback={defaultPizzaImage}
            width="100%"
            aspectRatio={1}
            alignSelf="center"
            resizeMode="cover"
            placeholderStyle={{
              width: 500,
              height: 500,
              aspectRatio: 1,
              alignSelf: "center",
            }}
            $gtXs={{ width: "100%", height: "auto" }}
            $gtLg={{ width: "50%", height: "auto" }}
          />
          <Text {...styles.description}>
            Product Description: {product?.description}
          </Text>
          <Text {...styles.price}>Price: ${product?.price}</Text>
        </YStack>
      </ScrollView>
    </Theme>
  );
}

interface StyleProps {
  container: GetProps<typeof ScrollView>;
  price: GetProps<typeof Text>;
  description: GetProps<typeof Text>;
}

const styles: StyleProps = {
  container: {
    width: "100%",
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
