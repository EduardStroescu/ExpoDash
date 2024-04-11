import { boneColor, highlightColor } from "@/lib/constants/Colors";
import { imagePlaceholder } from "@/lib/constants/imagePlaceholder";
import { LinearGradient } from "expo-linear-gradient";
import { ComponentProps, useEffect, useState } from "react";
import { ImageStyle, StyleProp } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Image, View } from "tamagui";
import { supabase } from "../lib/supabase/supabase";

type RemoteImageProps = {
  path?: string | null;
  placeholderStyle?: any;
} & Omit<ComponentProps<typeof Image>, "source">;

const RemoteImage = ({
  path,
  placeholderStyle,
  ...imageProps
}: RemoteImageProps) => {
  const [image, setImage] = useState(imagePlaceholder);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!path) {
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);

    if (data) {
      setImage(data.publicUrl);
    }
  }, [path]);

  const onLoad = () => {
    if (image !== imagePlaceholder) {
      setImageLoaded(true);
    }
  };

  return (
    <View position="relative">
      <Image
        {...imageProps}
        opacity={!imageLoaded ? 0 : 1}
        onLoad={onLoad}
        source={{
          uri: image,
        }}
      />
      {!imageLoaded && <ImageSkeleton style={placeholderStyle} />}
    </View>
  );
};

export default RemoteImage;

interface ImageSkeletonProps {
  style: StyleProp<ImageStyle>;
}

function ImageSkeleton({ style }: ImageSkeletonProps) {
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
          position: "absolute",
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
