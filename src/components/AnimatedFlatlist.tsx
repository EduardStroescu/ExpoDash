import React from "react";
import { FlatListProps, StyleProp, ViewStyle } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

type AnimatedFlatlistOwnProps<T> = {
  data: T[] | null | undefined;
  renderItem: (params: {
    item: T;
    index: number;
    scrollY: SharedValue<number>;
  }) => React.ReactElement<any> | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
  maxToRenderPerBatch?: number;
  scrollEventThrottle?: number;
};

type AnimatedFlatlistProps<T> = AnimatedFlatlistOwnProps<T> &
  Omit<FlatListProps<T>, keyof AnimatedFlatlistOwnProps<T>>;

export default function AnimatedFlatList<T>({
  data,
  renderItem,
  contentContainerStyle,
  scrollEventThrottle = 16,
  maxToRenderPerBatch = 10,
  ...props
}: AnimatedFlatlistProps<T>) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      scrollY.value = y;
    },
  });

  return (
    <Animated.FlatList
      data={data}
      renderItem={(params) => renderItem({ ...params, scrollY })}
      contentContainerStyle={contentContainerStyle}
      onScroll={scrollHandler}
      scrollEventThrottle={scrollEventThrottle}
      maxToRenderPerBatch={maxToRenderPerBatch}
      {...props}
    />
  );
}
