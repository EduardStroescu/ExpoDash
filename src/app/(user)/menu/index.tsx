import { useColorScheme, Platform } from "react-native";
import ProductListItem from "@/components/ProductListItem";
import { useProductList } from "../../api/products";
import Header from "@/components/webOnlyComponents/Header";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import { useEffect } from "react";
import AnimatedFlatList from "@/components/AnimatedFlatlist";
import { Text, Theme, View } from "tamagui";

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
    <Theme name={colorScheme}>
      <View {...styles.container}>
        {Platform.OS === "web" && <Header />}
        <AnimatedFlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index, scrollY }) => (
            <ProductListItem product={item} index={index} scrollY={scrollY} />
          )}
          numColumns={Platform.OS === "web" ? 6 : 1}
          {...styles.contentContainerStyle}
        />
      </View>
    </Theme>
  );
}

const styles = {
  container: { height: "100%", flex: 1, backgroundColor: "$background" },
  contentContainerStyle: {
    contentContainerStyle: {
      gap: 10,
      paddingVertical: 10,
    },
  },
};
