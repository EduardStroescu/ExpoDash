import { useWindowDimensions } from "react-native";
import {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

interface AnimatedFlatListParams {
  NOTIFICATION_HEIGHT?: number;
  index?: number;
  scrollY?: SharedValue<number>;
}

export default function useAnimatedFlatList({
  NOTIFICATION_HEIGHT,
  index,
  scrollY,
}: AnimatedFlatListParams = {}) {
  const { height } = useWindowDimensions();
  const containerHeight = useDerivedValue(() => height - 120);

  if (!scrollY || !NOTIFICATION_HEIGHT || !index) return { animatedStyle: {} };

  const startPosition = NOTIFICATION_HEIGHT * index - 20;

  const animatedStyle = useAnimatedStyle(() => {
    const pos1 = startPosition - containerHeight.value;
    const pos2 = startPosition + NOTIFICATION_HEIGHT - containerHeight.value;

    if (scrollY?.value >= 0) {
      // animating the last visible item
      return {
        opacity: interpolate(scrollY.value, [pos1, pos2], [0, 1]),
        transform: [
          {
            translateY: interpolate(
              scrollY.value,
              [pos1, pos2],
              [-NOTIFICATION_HEIGHT / 2, 0],
              Extrapolation.CLAMP,
            ),
          },
          {
            scale: interpolate(
              scrollY.value,
              [pos1, pos2],
              [0.8, 1],
              Extrapolation.CLAMP,
            ),
          },
        ],
      };
    } else {
      return {};
    }
  });

  return { animatedStyle };
}
