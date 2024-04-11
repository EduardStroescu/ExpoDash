import { RootState } from "@/lib/reduxStore";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { useSelector } from "react-redux";

export default function AnimatedLoader({
  overwriteState = false,
}: {
  overwriteState?: boolean;
}) {
  const { isLoading } = useSelector((state: RootState) => state.app);

  if (!isLoading && !overwriteState) return null;

  return (
    <Animated.View style={styles.container} exiting={FadeOut.duration(1000)}>
      <LottieView
        autoPlay
        loop
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
        }}
        source={require("@assets/animations/Loader.json")}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
});
