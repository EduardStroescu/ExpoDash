import { useEffect } from "react";
import Svg, { G, Path } from "react-native-svg";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  interpolateColor,
  useAnimatedStyle,
  Easing,
  StyleProps,
} from "react-native-reanimated";
import { useWindowDimensions } from "tamagui";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function SvgBackground() {
  const color = useSharedValue(0);
  const { width } = useWindowDimensions();

  useEffect(() => {
    color.value = withRepeat(
      withTiming(1 - color.value, {
        duration: 2000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, []);

  const colorChange: StyleProps = useAnimatedStyle(() => ({
    color: interpolateColor(
      color.value,
      [0, 1],
      ["rgb(86, 2, 124)", "rgb(174, 0, 255)"],
    ),
  }));

  return (
    <AnimatedSvg
      style={[styles.svg, colorChange]}
      width="110%"
      height="110%"
      viewBox={`${width <= 667 ? 13.1 : 200} ${width <= 667 ? 73 : 20} ${width <= 667 ? 200 : 300} ${width <= 667 ? 200 : 300}`}
      stroke="currentColor"
      opacity="0.4"
    >
      <Path d="M0 0h666.8v448.4H0z" />
      <G>
        <Path
          strokeOpacity={0.25}
          d="M12 0v448.4M24 0v448.4M36 0v448.4M48 0v448.4M60 0v448.4"
        />
        <Path strokeOpacity={0.25} d="M72 0v448.4" />
        <Path
          strokeOpacity={0.25}
          d="M84 0v448.4M96 0v448.4M108 0v448.4M120 0v448.4M132 0v448.4"
        />
        <Path strokeOpacity={0.25} d="M144 0v448.4" />
        <Path
          strokeOpacity={0.25}
          d="M156 0v448.4M168 0v448.4M180 0v448.4M192 0v448.4M204 0v448.4"
        />
        <Path strokeOpacity={0.25} d="M216 0v448.4" />
        <Path
          strokeOpacity={0.25}
          d="M228 0v448.4M240 0v448.4M252 0v448.4M264 0v448.4M276 0v448.4"
        />
        <Path strokeOpacity={0.25} d="M288 0v448.4" />
        <Path
          strokeOpacity={0.25}
          d="M300 0v448.4M312 0v448.4M324 0v448.4M336 0v448.4M348 0v448.4"
        />
        <Path strokeOpacity={0.25} d="M360 0v448.4" />
        <Path
          strokeOpacity={0.25}
          d="M372 0v448.4M384 0v448.4M396 0v448.4M408 0v448.4M420 0v448.4"
        />
        <Path strokeOpacity={0.25} d="M432 0v448.4" />
        <Path
          strokeOpacity={0.25}
          d="M444 0v448.4M456 0v448.4M468 0v448.4M480 0v448.4M492 0v448.4"
        />
        <Path strokeOpacity={0.25} d="M504 0v448.4" />
        <Path
          strokeOpacity={0.25}
          d="M516 0v448.4M528 0v448.4M540 0v448.4M552 0v448.4M564 0v448.4"
        />
        <Path strokeOpacity={0.25} d="M576 0v448.4" />
        <Path
          strokeOpacity={0.25}
          d="M588 0v448.4M600 0v448.4M612 0v448.4M624 0v448.4M636 0v448.4"
        />
        <Path strokeOpacity={0.25} d="M648 0v448.4" />
        <Path
          strokeOpacity={0.25}
          d="M660 0v448.4M0 12h666.8M0 24h666.8M0 36h666.8M0 48h666.8M0 60h666.8"
        />
        <Path strokeOpacity={0.25} d="M0 72h666.8" />
        <Path
          strokeOpacity={0.25}
          d="M0 84h666.8M0 96h666.8M0 108h666.8M0 120h666.8M0 132h666.8"
        />
        <Path strokeOpacity={0.25} d="M0 144h666.8" />
        <Path
          strokeOpacity={0.25}
          d="M0 156h666.8M0 168h666.8M0 180h666.8M0 192h666.8M0 204h666.8"
        />
        <Path strokeOpacity={0.25} d="M0 216h666.8" />
        <Path
          strokeOpacity={0.25}
          d="M0 228h666.8M0 240h666.8M0 252h666.8M0 264h666.8M0 276h666.8"
        />
        <Path strokeOpacity={0.25} d="M0 288h666.8" />
        <Path
          strokeOpacity={0.25}
          d="M0 300h666.8M0 312h666.8M0 324h666.8M0 336h666.8M0 348h666.8"
        />
        <Path strokeOpacity={0.25} d="M0 360h666.8" />
        <Path
          strokeOpacity={0.25}
          d="M0 372h666.8M0 384h666.8M0 396h666.8M0 408h666.8M0 420h666.8"
        />
        <Path strokeOpacity={0.25} d="M0 432h666.8" />
        <Path strokeOpacity={0.25} d="M0 444h666.8" />
      </G>
    </AnimatedSvg>
  );
}

const styles = StyleSheet.create({
  svg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: -10,
    right: 0,
    zIndex: -1,
  },
});
