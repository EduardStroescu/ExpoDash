import { useWindowDimensions } from "react-native";
import {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

interface AnimatedFlatListParams {
  NOTIFICATION_HEIGHT: number;
  index: number;
  scrollY: SharedValue<number>;
}

export default function useAnimatedFlatList({
  NOTIFICATION_HEIGHT,
  index,
  scrollY,
}: AnimatedFlatListParams) {
  const { height } = useWindowDimensions();
  const containerHeight = useDerivedValue(() => height - 120);

  const startPosition = NOTIFICATION_HEIGHT * index - 10;

  const animatedStyle = useAnimatedStyle(() => {
    const pos1 = startPosition - containerHeight.value;
    const pos2 = startPosition + NOTIFICATION_HEIGHT - containerHeight.value;

    if (scrollY?.value >= 0 && NOTIFICATION_HEIGHT && index) {
      // animating the last visible item
      return {
        pointerEvents: scrollY.value >= pos1 ? "auto" : "none",
        opacity: interpolate(scrollY.value, [pos1, pos2], [0.1, 1]),
        transform: [
          {
            translateY: interpolate(
              scrollY.value,
              [pos1, pos2],
              [-NOTIFICATION_HEIGHT / 5, 0],
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
