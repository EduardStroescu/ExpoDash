import { LinearGradient } from "expo-linear-gradient";

export function InlineGradient({
  colors = ["transparent", "#7938b2b4", "transparent"],
  width = [0, 0],
}: {
  colors?: string[];
  width?: [x: number, y: number] | false;
}) {
  return (
    <LinearGradient
      colors={colors}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        position: "absolute",
        top: 0,
        left: width ? width[0] : 0,
        right: width ? width[1] : 0,
        bottom: 0,
        zIndex: -1,
      }}
    />
  );
}
