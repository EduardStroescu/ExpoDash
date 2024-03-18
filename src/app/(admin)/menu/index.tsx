import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  useColorScheme,
  ScrollView,
} from "react-native";
import ProductListItem from "@/components/ProductListItem";
import { useProductList } from "../../api/products";
import Colors from "@/lib/constants/Colors";

export default function Menu() {
  const colorScheme = useColorScheme();
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <View
      style={{
        height: "100%",
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        numColumns={1}
        contentContainerStyle={{ gap: 10, padding: 10, height: "100%" }}
      />
    </View>
  );
}
