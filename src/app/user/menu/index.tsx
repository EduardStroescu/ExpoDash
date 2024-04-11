import AnimatedFlatList from "@/components/AnimatedFlatlist";
import PageError from "@/components/PageError";
import ProductListItem from "@/components/ProductListItem";
import { SkeletonProductListItem } from "@/components/skeletons/SkeletonProductListItem";
import Header from "@/components/webOnlyComponents/Header";
import { useResponsiveStyle } from "@/lib/hooks/useResponsiveStyle";
import { Platform, useColorScheme } from "react-native";
import { Theme, View, useWindowDimensions } from "tamagui";
import { useProductList } from "../../api/products";

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

  if (error) {
    return <PageError />;
  }

  return (
    <Theme name={colorScheme}>
      {Platform.OS === "web" && <Header />}
      {isLoading ? (
        <View {...styles.container}>
          <AnimatedFlatList
            {...styles.contentContainerStyle}
            data={Array(10)}
            key={columnNumber}
            renderItem={({ index, scrollY }) => (
              <SkeletonProductListItem
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
      ) : (
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
      )}
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
