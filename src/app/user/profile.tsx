import Button from "@/components/Button";
import Input from "@/components/Input";
import LogoutButton from "@/components/logoutButton/LogoutButton";
import SvgBackground from "@/components/svgBackground/SvgBackground";
import Header from "@/components/webOnlyComponents/Header";
import { ToastOptions } from "@/lib/constants/ToastOptions";
import { imagePlaceholder } from "@/lib/constants/imagePlaceholder";
import {
  uploadUserAvatarMobile,
  uploadUserAvatarWeb,
} from "@/lib/helpers/uploadImage";
import { RootState } from "@/lib/reduxStore";
import { supabase } from "@/lib/supabase/supabase";
import { Tables, UpdateTables } from "@/lib/types";
import { toast } from "@backpackapp-io/react-native-toast";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  GestureResponderEvent,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { useSelector } from "react-redux";
import {
  Avatar,
  Card,
  GetProps,
  ScrollView,
  Text,
  Theme,
  XStack,
  YStack,
  useWindowDimensions,
} from "tamagui";
import {
  useUpdateProfileAvatar,
  useUpdateProfileDetails,
} from "../api/profiles";

export default function ProfileScreen() {
  const [profileAvatar, setProfileAvatar] = useState("");
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const colorScheme = useColorScheme();
  const { profile: user } = useSelector((state: RootState) => state.auth);
  const { mutate: updatedProfileAvatar } = useUpdateProfileAvatar();

  const pickImage = async (
    event: React.ChangeEvent<HTMLInputElement> | GestureResponderEvent,
  ) => {
    if (Platform.OS !== "web") {
      setIsAvatarLoading(true);
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imagePath = await uploadUserAvatarMobile(result.assets[0].uri);
        updatedProfileAvatar({ avatar_url: imagePath });
        setProfileAvatar(result.assets[0].uri);
        setIsAvatarLoading(false);
      }
    } else {
      setIsAvatarLoading(true);
      const e = event as React.ChangeEvent<HTMLInputElement>;
      if (!e.target.files?.length) return;
      const fileReader = new FileReader();
      const file = e.target.files[0];
      fileReader.readAsDataURL(file);

      fileReader.onloadend = async () => {
        const content = fileReader.result;
        if (content && typeof content === "string") {
          const imagePath = await uploadUserAvatarWeb(content);
          updatedProfileAvatar({ avatar_url: imagePath });
          setProfileAvatar(content);
          setIsAvatarLoading(false);
        }
      };
    }
  };

  useEffect(() => {
    if (user) {
      if (user.avatar_url) {
        const { data: userAvatar } = supabase.storage
          .from("user-avatars")
          .getPublicUrl(user.avatar_url);
        if (userAvatar) {
          setProfileAvatar(userAvatar.publicUrl);
        }
      }
    }
  }, [user]);

  if (!user) return;

  return (
    <Theme name={colorScheme}>
      {Platform.OS === "web" && <Header />}
      <SvgBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={65}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView {...styles.page}>
          <YStack {...styles.container}>
            <Card {...styles.card}>
              <Avatar circular size="$15" elevate elevation="$1">
                <Avatar.Image src={profileAvatar || imagePlaceholder} />
                <Avatar.Fallback bc="#0c103385" />
              </Avatar>
              <Card.Footer flexDirection="column" alignItems="center" gap="$4">
                <Text borderRadius="$10" color="white">
                  {user?.username || user?.email?.split("@")[0]}
                </Text>
                <XStack gap="$2" flexWrap="wrap" justifyContent="center">
                  {Platform.OS !== "web" ? (
                    <Button
                      {...styles.smallButton}
                      text={
                        !isAvatarLoading ? "Change Avatar" : "Changing avatar"
                      }
                      onPress={pickImage}
                      disabled={isAvatarLoading}
                    />
                  ) : (
                    <Button
                      {...styles.smallButton}
                      position="relative"
                      overflow="hidden"
                      disabled={isAvatarLoading}
                    >
                      {!isAvatarLoading
                        ? "Change Avatar"
                        : "Changing avatar..."}
                      <input type="file" onChange={pickImage} />
                    </Button>
                  )}
                  <LogoutButton {...styles.smallButton} />
                </XStack>
              </Card.Footer>
            </Card>
            <ChangeProfileDetailsForm user={user} />
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Theme>
  );
}

function ChangeProfileDetailsForm({ user }: { user: Tables<"profiles"> }) {
  const { width } = useWindowDimensions();
  const [userDetails, setUserDetails] = useState<UpdateTables<"profiles">>({
    username: "",
    email: "",
    address: "",
    country: "",
    city: "",
    phone: "",
    postal_code: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: updatedProfileData } = useUpdateProfileDetails();

  const onUpdateProfileDetails = () => {
    if (userDetails) {
      setIsSubmitting(true);
      updatedProfileData(userDetails, {
        onSuccess: () => {
          toast.success("Profile Updated", ToastOptions({ iconName: "check" }));
          setIsSubmitting(false);
        },
      });
    }
  };

  useEffect(() => {
    setUserDetails((prev) => {
      const updatedDetails = { ...prev };
      for (const key in prev) {
        if (user?.[key as keyof typeof user]) {
          updatedDetails[key as keyof typeof user] = user?.[
            key as keyof typeof user
          ] as string;
        }
      }
      return updatedDetails;
    });
  }, [user]);

  return (
    <YStack
      gap="$3"
      width="100%"
      justifyContent="center"
      alignItems="center"
      marginVertical="$3"
      paddingHorizontal="$3"
    >
      <XStack alignItems="center" gap="$2" width="100%">
        <Text {...styles.rowTitle}>Full Name:</Text>
        <Input
          flex={1}
          value={userDetails?.username as string}
          placeholder="Not added yet"
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, username: value }))
          }
        />
      </XStack>
      <XStack alignItems="center" gap="$2" width="100%">
        <Text {...styles.rowTitle}>Email:</Text>
        <Input
          flex={1}
          value={userDetails?.email as string}
          placeholder="Not added yet"
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, email: value }))
          }
        />
      </XStack>
      <XStack alignItems="center" gap="$2" width="100%">
        <Text {...styles.rowTitle}>Phone:</Text>
        <Input
          flex={1}
          value={userDetails?.phone as string}
          placeholder="Not added yet"
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, phone: value }))
          }
        />
      </XStack>
      <XStack gap="$3" flexWrap="wrap" width="100%">
        <XStack alignItems="center" gap="$2" minWidth={170} flex={1}>
          <Text {...styles.rowTitle}>Country:</Text>
          <Input
            flex={1}
            value={userDetails?.country as string}
            placeholder="Not added yet"
            onChangeText={(value) =>
              setUserDetails((prev) => ({ ...prev, country: value }))
            }
          />
        </XStack>
        <XStack alignItems="center" gap="$2" minWidth={160} flex={1}>
          <Text
            {...styles.rowTitle}
            minWidth={width > 414 ? "unset" : 70}
            $gtXs={{ textAlign: "auto" }}
          >
            City:
          </Text>
          <Input
            flex={1}
            value={userDetails?.city as string}
            placeholder="Not added yet"
            onChangeText={(value) =>
              setUserDetails((prev) => ({ ...prev, city: value }))
            }
          />
        </XStack>
        <XStack alignItems="center" gap="$2" minWidth={160} flex={1}>
          <Text
            {...styles.rowTitle}
            maxWidth={70}
            $gtXs={{ textAlign: "center" }}
          >
            Postal Code:
          </Text>
          <Input
            flex={1}
            value={userDetails?.postal_code as string}
            placeholder="Not added yet"
            onChangeText={(value) =>
              setUserDetails((prev) => ({ ...prev, postal_code: value }))
            }
          />
        </XStack>
      </XStack>
      <XStack alignItems="center" gap="$2" width="100%">
        <Text {...styles.rowTitle}>Address:</Text>
        <Input
          flex={1}
          value={userDetails?.address as string}
          placeholder="Not added yet"
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, address: value }))
          }
        />
      </XStack>

      <Button onPress={onUpdateProfileDetails} disabled={isSubmitting}>
        {!isSubmitting ? "Change Details" : "Updaing Profile"}
      </Button>
    </YStack>
  );
}

interface StyleTypes {
  page: GetProps<typeof ScrollView>;
  container: GetProps<typeof YStack>;
  card: GetProps<typeof Card>;
  smallButton: GetProps<typeof Button>;
  rowTitle: GetProps<typeof Text>;
}

const styles: StyleTypes = {
  page: {
    width: "100%",
    height: "100%",
    contentContainerStyle: { alignItems: "center" },
    $gtMd: {
      justifyContent: "center",
      alignItems: "center",
    },
  },
  container: {
    width: "95%",
    margin: 10,
    padding: 10,
    $gtSm: {
      width: "40%",
      minWidth: 700,
      maxWidth: 1000,
    },
    gap: "$2",
    backgroundColor: "#0c1033b2",
    borderRadius: 20,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#232b5d85",
    padding: "$3",
    alignItems: "center",
    gap: "$5",
  },
  smallButton: {
    fontSize: "$2",
  },
  rowTitle: {
    minWidth: 70,
    fontSize: 14,
    color: "white",
  },
};
