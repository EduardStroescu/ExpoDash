import { Image, ImageStyle, StyleProp, View } from "react-native";
import { ComponentProps, useEffect, useState } from "react";
import { supabase } from "../lib/supabase/supabase";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { defaultPizzaImage } from "@assets/data/products";

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
} & Omit<ComponentProps<typeof Image>, "source">;

const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
  const [image, setImage] = useState("");
  const { style } = imageProps;

  useEffect(() => {
    if (!path) {
      return setImage(defaultPizzaImage);
    }
    (async () => {
      setImage("");
      const { data, error } = await supabase.storage
        .from("product-images")
        .download(path);

      if (error) {
        setImage(defaultPizzaImage);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      }
    })();
  }, [path]);

  if (!image) return <ImagePlaceholder style={style} image={image} />;

  return <Image source={{ uri: image || fallback }} {...imageProps} />;
};

export default RemoteImage;

interface ImagePlaceholderProps {
  style: StyleProp<ImageStyle>;
  image: string;
}

const boneColor = "#413d3c";
const highlightColor = "#4d4948";

function ImagePlaceholder({ style, image }: ImagePlaceholderProps) {
  const translateX = useSharedValue(400);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-400, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
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
        })
      ),
      -1,
      true
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
