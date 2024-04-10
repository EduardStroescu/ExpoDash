import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Tables } from "../lib/types";
import Animated, { FadeInLeft } from "react-native-reanimated";
import {
  View,
  Text,
  GetProps,
  Button,
  YStack,
  XStack,
  useWindowDimensions,
} from "tamagui";
dayjs.extend(relativeTime);

interface OrderIdOrderDetailsProps {
  order: Tables<"orders">;
}

export default function OrderIdOrderDetails({
  order,
}: OrderIdOrderDetailsProps) {
  const { width } = useWindowDimensions();
  return (
    <Animated.View
      entering={FadeInLeft.duration(700)}
      style={{
        minHeight: width <= 660 ? 140 : 100,
      }}
    >
      <View {...styles.container}>
        <Text {...styles.title}>Order Datails</Text>
        <XStack {...styles.detailsRow} width="100%">
          <YStack flex={1} alignItems="flex-start">
            <Text {...styles.detailsRowText}>Name: {order.user_name}</Text>
            <Text {...styles.detailsRowText}>Country: {order.country}</Text>
            <Text {...styles.detailsRowText}>
              Address: Str. Miahil Strajan, Nr. 15, Bl. 12, Sc. 1, Fl. 4, Apt.
              17
            </Text>
          </YStack>
          <YStack flex={1} alignItems="flex-end">
            <Text {...styles.detailsRowText}>Phone: {order.phone}</Text>
            <Text {...styles.detailsRowText}>City: {order.city}</Text>
            <Text {...styles.detailsRowText}>
              Postal Code: {order.postal_code}
            </Text>
          </YStack>
        </XStack>
      </View>
    </Animated.View>
  );
}

interface StyleTypes {
  container: GetProps<typeof Button>;
  title: GetProps<typeof Text>;
  detailsRow: GetProps<typeof YStack>;
  detailsRowText: GetProps<typeof Text>;
}

const styles: StyleTypes = {
  container: {
    flex: 1,
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#141414",
    borderEndEndRadius: 10,
    borderEndStartRadius: 10,
    gap: "$2",
    width: "96%",
    $gtMd: { width: "99%" },
    alignSelf: "center",
  },
  title: {
    color: "$blue10",
    fontWeight: "500",
    fontSize: 16,
    $gtMd: { marginBottom: 5 },
  },
  detailsRow: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsRowText: {
    color: "$color10",
    $xs: {
      fontSize: 14,
    },
  },
};
