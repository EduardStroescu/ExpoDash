import { useColorScheme, Platform } from "react-native";
import ProductListItem from "@/components/ProductListItem";
import { useProductList } from "../../api/products";
import Header from "@/components/webOnlyComponents/Header";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/lib/features/appSlice";
import { useEffect } from "react";
import AnimatedFlatList from "@/components/AnimatedFlatlist";
import { Text, Theme, View, useWindowDimensions } from "tamagui";
import { useResponsiveStyle } from "@/lib/hooks/useResponsiveStyle";

export default function Menu() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const { data: products, error, isLoading } = useProductList();
  const columnBreakpoints = {
    default: 1,
    sm: 1,
    md: 2,
    gtMd: 3,
    lg: 4,
    xl: 6,
    gtXl: 6,
  };
  const columnNumber = useResponsiveStyle(columnBreakpoints, width);

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
      {Platform.OS === "web" && <Header />}

      <View {...styles.container}>
        <AnimatedFlatList
          {...styles.contentContainerStyle}
          data={products}
          key={columnNumber}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index, scrollY }) => (
            <ProductListItem
              product={item}
              index={index}
              scrollY={scrollY}
              columnNumber={columnNumber}
            />
          )}
          numColumns={columnNumber}
          contentContainerStyle={{
            paddingHorizontal: width <= 660 ? 0 : 10,
            paddingVertical: width <= 660 ? 10 : 10,
          }}
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
    },
  },
};
