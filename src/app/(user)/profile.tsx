import Button from "@/components/Button";
import LogoutButton from "@/components/logoutButton/LogoutButton";
import Header from "@/components/webOnlyComponents/Header";
import { useColorScheme, Platform } from "react-native";
import { Avatar, Card, ScrollView, Text, Theme, XStack, YStack } from "tamagui";
import {
  useUpdateProfileAvatar,
  useUpdateProfileDetails,
} from "../api/profiles";
import { useEffect, useState } from "react";
import {
  uploadUserAvatarMobile,
  uploadUserAvatarWeb,
} from "@/lib/helpers/uploadImage";
import { supabase } from "@/lib/supabase/supabase";
import * as ImagePicker from "expo-image-picker";
import Input from "@/components/Input";
import { UpdateTables } from "@/lib/types";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/reduxStore";
import { defaultPizzaImage } from "@assets/data/products";

export default function ProfileScreen() {
  const [profileAvatar, setProfileAvatar] = useState("");
  const colorScheme = useColorScheme();
  const { profile: user } = useSelector((state: RootState) => state.auth);

  const { mutate: updatedProfileAvatar } = useUpdateProfileAvatar();

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <Theme name={colorScheme}>
      {Platform.OS === "web" && <Header />}

      <ScrollView {...styles.page}>
        <YStack {...styles.container}>
          <Card {...styles.card}>
            <Avatar circular size="$15" elevate elevation="$1">
              <Avatar.Image src={profileAvatar || defaultPizzaImage} />
              <Avatar.Fallback bc="#0c103385" />
            </Avatar>
            <Card.Footer flexDirection="column" alignItems="center" gap="$4">
              <Text borderRadius="$10">
                {user?.username || user?.email?.split("@")[0]}
              </Text>
              <XStack gap="$2" flexWrap="noWrap" justifyContent="center">
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
    </Theme>
  );
}

function ChangeProfileDetailsForm({
  user,
}: {
  user: UpdateTables<"profiles">;
}) {
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
      const updatedDetails: typeof user = { ...prev };
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
        <Text fontSize={14}>Username:</Text>
        <Input
          flex={1}
          value={userDetails?.username}
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, username: value }))
          }
        />
      </XStack>
      <XStack alignItems="center" gap="$2" width="100%">
        <Text fontSize={14}>Phone:</Text>
        <Input
          flex={1}
          value={userDetails?.phone}
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, phone: value }))
          }
        />
      </XStack>
      <XStack alignItems="center" gap="$2" width="100%">
        <Text fontSize={14}>Email:</Text>
        <Input
          flex={1}
          value={userDetails?.email}
          onChangeText={(value) =>
            setUserDetails((prev) => ({ ...prev, email: value }))
          }
        />
      </XStack>
      <XStack alignItems="center" gap="$2" width="100%">
        <Text fontSize={14}>Address:</Text>
        <Input
          flex={1}
          value={userDetails?.address}
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
  page: React.ComponentPropsWithoutRef<typeof ScrollView>;
  container: React.ComponentPropsWithoutRef<typeof YStack>;
  card: React.ComponentPropsWithoutRef<typeof Card>;
  smallButton: React.ComponentPropsWithoutRef<typeof Button>;
}

const styles: StyleProps = {
  page: {
    width: "100%",
    height: "100%",
    backgroundColor: "$background",
    contentContainerStyle: { alignItems: "center" },
  },
  container: {
    width: "95%",
    margin: 10,
    padding: 10,
    $gtMd: { width: "30%" },
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
};
