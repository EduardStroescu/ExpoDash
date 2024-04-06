import { LayoutChangeEvent } from "react-native";
import useAnimatedFlatList from "@/lib/hooks/useAnimatedFlatList";
import Animated, { SharedValue } from "react-native-reanimated";
import { GetProps, View, XStack, YStack, useWindowDimensions } from "tamagui";
import { useState } from "react";
import { useResponsiveStyle } from "@/lib/hooks/useResponsiveStyle";

interface SkeletonProductListItemProps {
  index: number;
  scrollY: SharedValue<number>;
  columnNumber: number;
}

export function SkeletonProductListItem({
  index,
  scrollY,
  columnNumber,
}: SkeletonProductListItemProps) {
  const [height, setHeight] = useState(150);
  const { width } = useWindowDimensions();
  const columnBreakpoints = {
    default: height,
    sm: height,
    md: (25 / 100) * (columnNumber * height),
    gtMd: (12 / 100) * (columnNumber * height),
    lg: (7.7 / 100) * (columnNumber * height),
    xl: (3.6 / 100) * (columnNumber * height),
    gtXl: (3.65 / 100) * (columnNumber * height),
  };
  const NOTIFICATION_HEIGHT = useResponsiveStyle(columnBreakpoints, width);

  const { animatedStyle } = useAnimatedFlatList({
    scrollY,
    NOTIFICATION_HEIGHT,
    index,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  };

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        animatedStyle,
        {
          flex: 1 / columnNumber,
        },
      ]}
    >
      <View flex={1} paddingHorizontal={10}>
        {/* Image */}
        <View
          height={width <= 600 ? 110 : 300}
          width="100%"
          borderRadius={20}
          alignSelf="center"
          backgroundColor="#262626"
        />
        <YStack {...styles.primaryContainer}>
          {/* Description */}
          <View backgroundColor="#262626" width={"100%"} height={11} />
          <View backgroundColor="#262626" width={200} height={11} />
          <XStack {...styles.secondaryContainer}>
            {/* Name */}
            <View backgroundColor="#262626" width={50} height={16} />
            {/* Price */}
            <View backgroundColor="#262626" width={20} height={16} />
          </XStack>
        </YStack>
      </View>
    </Animated.View>
  );
}

interface StyleProps {
  primaryContainer: GetProps<typeof YStack>;
  secondaryContainer: GetProps<typeof XStack>;
}

const styles: StyleProps = {
  primaryContainer: {
    width: "100%",
    padding: 10,
    gap: "$2",
  },
  secondaryContainer: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
