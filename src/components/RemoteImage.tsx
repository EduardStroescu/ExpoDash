import { ImageStyle, StyleProp } from "react-native";
import { ComponentProps, useEffect, useState } from "react";
import { supabase } from "../lib/supabase/supabase";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { defaultPizzaImage } from "@assets/data/products";
import { Image } from "tamagui";

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
  placeholderStyle: any;
} & Omit<ComponentProps<typeof Image>, "source">;

const RemoteImage = ({
  path,
  fallback,
  placeholderStyle,
  ...imageProps
}: RemoteImageProps) => {
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!path) {
      return setImage(defaultPizzaImage);
    }
    setImage("");
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);

    if (data) {
      setImage(data.publicUrl);
    }
  }, [path]);

  if (!image)
    return <ImagePlaceholder style={placeholderStyle} image={image} />;

  return (
    <Image
      {...imageProps}
      source={{
        width: 400,
        height: 400,
        uri: image || fallback,
      }}
    />
  );
};

export default RemoteImage;

interface ImagePlaceholderProps {
  style: StyleProp<ImageStyle>;
  image: string;
}

const boneColor = "#413d3c";
const highlightColor = "#4d4948";

function ImagePlaceholder({ style }: ImagePlaceholderProps) {
  const translateX = useSharedValue(400);
  const opacity = useSharedValue(0);

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
      style={[
        style,
        animatedOpacity,
        {
          overflow: "hidden",
          backgroundColor: boneColor,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Animated.View
        style={[
          animatedTranslateX,
          {
            height: "100%",
            position: "absolute",
            width: "100%",
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
    </Animated.View>
  );
}
