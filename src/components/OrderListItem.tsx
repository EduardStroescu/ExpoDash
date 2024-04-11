import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { router, useSegments } from "expo-router";
import Animated, { SlideInUp } from "react-native-reanimated";
import { Button, GetProps, Text, View } from "tamagui";
import { Tables } from "../lib/types";
dayjs.extend(relativeTime);

interface OrderListItemProps {
  order: Tables<"orders">;
  hoverStyle?: GetProps<typeof Button>;
}

export default function OrderListItem({
  order,
  hoverStyle = { cursor: "pointer" },
}: OrderListItemProps) {
  const segments = useSegments();

  return (
    <Animated.View
      entering={SlideInUp.duration(1000)}
      style={{
        backgroundColor: "#262626",
        height: 60,
      }}
    >
      <Button
        unstyled
        hoverStyle={hoverStyle}
        {...styles.container}
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

interface StyleTypes {
  container: GetProps<typeof Button>;
  title: GetProps<typeof Text>;
  subtitleContainer: GetProps<typeof View>;
  price: GetProps<typeof Text>;
}

const styles: StyleTypes = {
  container: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#262626",
  },
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
