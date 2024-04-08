import Button from "@/components/Button";
import LogoutButton from "@/components/logoutButton/LogoutButton";
import Header from "@/components/webOnlyComponents/Header";
import { useColorScheme, Platform, KeyboardAvoidingView } from "react-native";
import {
  Avatar,
  Card,
  GetProps,
  ScrollView,
  Text,
  Theme,
  XStack,
  YStack,
} from "tamagui";
import * as ImagePicker from "expo-image-picker";
import {
  useUpdateProfileAvatar,
  useUpdateProfileDetails,
} from "../api/profiles";
import {
  uploadUserAvatarMobile,
  uploadUserAvatarWeb,
} from "@/lib/helpers/uploadImage";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import Input from "@/components/Input";
import { UpdateTables, Tables } from "@/lib/types";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reduxStore";
import SvgBackground from "@/components/svgBackground/SvgBackground";
import { imagePlaceholder } from "@/lib/constants/imagePlaceholder";
import { GestureResponderEvent } from "react-native";

export default function ProfileScreen() {
  const [profileAvatar, setProfileAvatar] = useState("");
  const colorScheme = useColorScheme();

  const { profile: user } = useSelector((state: RootState) => state.auth);
  const { mutate: updatedProfileAvatar } = useUpdateProfileAvatar();

  const pickImage = async (
    event: React.ChangeEvent<HTMLInputElement> | GestureResponderEvent,
  ) => {
    if (Platform.OS !== "web") {
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
      }
    } else {
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
                      text="Change Avatar"
                      onPress={pickImage}
                    />
                  ) : (
                    <Button
                      {...styles.smallButton}
                      position="relative"
                      overflow="hidden"
                    >
                      Change Avatar
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
  const [userDetails, setUserDetails] = useState<UpdateTables<"profiles">>({
    username: "Not added yet",
    phone: "Not added yet",
    email: "Not added yet",
    address: "Not added yet",
  });

  const { mutate: updatedProfileData } = useUpdateProfileDetails();

  const onUpdateProfileDetails = () => {
    if (userDetails) {
      updatedProfileData(userDetails);
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
        <Text fontSize={14} color="white">
          Username:
        </Text>
        <Input
          flex={1}
          value={userDetails?.username as string}
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, username: value }))
          }
        />
      </XStack>
      <XStack alignItems="center" gap="$2" width="100%">
        <Text fontSize={14} color="white">
          Phone:
        </Text>
        <Input
          flex={1}
          value={userDetails?.phone as string}
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, phone: value }))
          }
        />
      </XStack>
      <XStack alignItems="center" gap="$2" width="100%">
        <Text fontSize={14} color="white">
          Email:
        </Text>
        <Input
          flex={1}
          value={userDetails?.email}
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, email: value }))
          }
        />
      </XStack>
      <XStack alignItems="center" gap="$2" width="100%">
        <Text fontSize={14} color="white">
          Address:
        </Text>
        <Input
          flex={1}
          value={userDetails?.address as string}
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, address: value }))
          }
        />
      </XStack>
      <Button onPress={onUpdateProfileDetails}>Change Details</Button>
    </YStack>
  );
}

interface StyleProps {
  page: GetProps<typeof ScrollView>;
  container: GetProps<typeof YStack>;
  card: GetProps<typeof Card>;
  smallButton: GetProps<typeof Button>;
}

const styles: StyleProps = {
  page: {
    width: "100%",
    height: "100%",
    contentContainerStyle: {
      alignItems: "center",
    },
    $gtMd: {
      height: "100%",
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
    backgroundColor: "#0c103385",
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
};
