import { LayoutChangeEvent, useColorScheme } from "react-native";
import React, { useState } from "react";
import Colors from "../lib/constants/Colors";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { router, useSegments } from "expo-router";
import { Tables } from "../lib/types";
import Animated, { SharedValue, SlideInDown } from "react-native-reanimated";
import useAnimatedFlatList from "@/lib/hooks/useAnimatedFlatList";
import { View, Text, GetProps, Button } from "tamagui";
import { StyleSheet } from "react-native";
dayjs.extend(relativeTime);

interface OrderListItemProps {
  order: Tables<"orders">;
  index?: number;
  scrollY?: SharedValue<number>;
  hoverStyle?: GetProps<typeof Button>;
}

export default function OrderListItem({
  order,
  index,
  scrollY,
  hoverStyle = { cursor: "pointer" },
}: OrderListItemProps) {
  const [height, setHeight] = useState(60);
  const segments = useSegments();

  const NOTIFICATION_HEIGHT = height + 5;

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
      entering={SlideInDown}
      style={[
        animatedStyle,
        {
          backgroundColor: "#262626",
          height: 60,
        },
      ]}
    >
      <Button
        unstyled
        hoverStyle={hoverStyle}
        style={style.container}
        onPress={() => router.navigate(`/${segments[0]}/orders/${order.id}`)}
      >
        <View flex={1}>
          <View flexDirection="row" gap={10} marginBottom={10}>
            <Text {...styles.title}>Order #{order.id}</Text>
            <Text color="white">-</Text>
            <Text {...styles.price}>${order.total.toFixed(2)}</Text>
          </View>
          <View {...styles.subtitleContainer}>
            <Text color="$color10">{dayjs(order.created_at).fromNow()}</Text>
          </View>
        </View>
        <View>
          <Text color="white">{order.status}</Text>
        </View>
      </Button>
    </Animated.View>
  );
}

interface StyleProps {
  title: GetProps<typeof Text>;
  subtitleContainer: GetProps<typeof View>;
  price: GetProps<typeof Text>;
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#262626",
  },
});

const styles: StyleProps = {
  title: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  subtitleContainer: {
    flexDirection: "row",
    gap: 5,
  },
  price: {
    color: "$blue10",
    fontWeight: "bold",
    fontSize: 16,
  },
};
