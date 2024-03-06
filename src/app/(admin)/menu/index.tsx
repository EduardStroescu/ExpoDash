import Colors from "@/src/lib/constants/Colors";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import ProductListItem from "@/src/components/ProductListItem";
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
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  );
}
