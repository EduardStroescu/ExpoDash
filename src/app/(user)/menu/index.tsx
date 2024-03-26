import {
  View,
  FlatList,
  Text,
  useColorScheme,
  Platform,
  StyleSheet,
} from "react-native";
import ProductListItem from "@/components/ProductListItem";
import { useProductList } from "../../api/products";
import Colors from "@/lib/constants/Colors";
import Header from "@/components/webOnlyComponents/Header";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import { useEffect } from "react";

export default function Menu() {
  const colorScheme = useColorScheme();
  const { data: products, error, isLoading } = useProductList();

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
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      {Platform.OS === "web" && <Header />}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductListItem product={item} />}
        numColumns={Platform.OS === "web" ? 3 : 1}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={Platform.OS === "web" && styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: "100%", flex: 1 },
  columnWrapper: {
    gap: 20,
    justifyContent: "space-between",
  },
});
