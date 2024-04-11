import { boneColor, highlightColor } from "@/lib/constants/Colors";
import useAnimatedFlatList from "@/lib/hooks/useAnimatedFlatList";
import { useResponsiveStyle } from "@/lib/hooks/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { GetProps, View, XStack, YStack, useWindowDimensions } from "tamagui";

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
  const translateX = useSharedValue(400);
  const opacity = useSharedValue(0);

  const { animatedStyle } = useAnimatedFlatList({
    scrollY,
    NOTIFICATION_HEIGHT,
    index,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height);
  };

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-400, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, {
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0.4, {
          duration: 300,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedTranslateX = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

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
        <Animated.View
          style={[
            animatedOpacity,
            {
              height: width <= 600 ? 110 : 300,
              width: "100%",
              borderRadius: 20,
              alignSelf: "center",
              backgroundColor: boneColor,
              overflow: "hidden",
              position: "relative",
            },
          ]}
        >
          <ShineAnimation animatedTranslateX={animatedTranslateX} />
        </Animated.View>
        <YStack {...styles.primaryContainer}>
          {/* Description */}
          <Animated.View
            style={[
              animatedOpacity,
              {
                backgroundColor: boneColor,
                width: "100%",
                height: 11,
                overflow: "hidden",
                position: "relative",
              },
            ]}
          >
            <ShineAnimation animatedTranslateX={animatedTranslateX} />
          </Animated.View>
          <Animated.View
            style={[
              animatedOpacity,
              {
                backgroundColor: boneColor,
                width: "100%",
                height: 11,
                overflow: "hidden",
                position: "relative",
              },
            ]}
          >
            <ShineAnimation animatedTranslateX={animatedTranslateX} />
          </Animated.View>
          <XStack {...styles.secondaryContainer}>
            {/* Name */}
            <Animated.View
              style={[
                animatedOpacity,
                {
                  backgroundColor: boneColor,
                  width: 50,
                  height: 16,
                  overflow: "hidden",
                  position: "relative",
                },
              ]}
            >
              <ShineAnimation animatedTranslateX={animatedTranslateX} />
            </Animated.View>
            {/* Price */}
            <Animated.View
              style={[
                animatedOpacity,
                {
                  backgroundColor: boneColor,
                  width: 40,
                  height: 16,
                  overflow: "hidden",
                  position: "relative",
                },
              ]}
            >
              <ShineAnimation animatedTranslateX={animatedTranslateX} />
            </Animated.View>
          </XStack>
        </YStack>
      </View>
    </Animated.View>
  );
}

function ShineAnimation({
  animatedTranslateX,
}: {
  animatedTranslateX: {
    transform: {
      translateX: number;
    }[];
  };
}) {
  return (
    <Animated.View
      style={[
        animatedTranslateX,
        {
          height: "100%",
          position: "absolute",
          width: "100%",
          zIndex: 9999,
        },
      ]}
    >
      <LinearGradient
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[boneColor!, highlightColor!, boneColor!]}
      />
    </Animated.View>
  );
}

interface StyleTypes {
  primaryContainer: GetProps<typeof YStack>;
  secondaryContainer: GetProps<typeof XStack>;
}

const styles: StyleTypes = {
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
