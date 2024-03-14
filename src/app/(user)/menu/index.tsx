import { View, FlatList, ActivityIndicator, Text } from "react-native";
import ProductListItem from "@/components/ProductListItem";
import { useProductList } from "../../api/products";

export default function Menu() {
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <View>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        numColumns={1}
        contentContainerStyle={{ gap: 10, padding: 10, height: "100%" }}
      />
    </View>
  );
}