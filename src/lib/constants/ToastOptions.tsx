import {
  DefaultToastOptions,
  ToastPosition,
} from "@backpackapp-io/react-native-toast";
import { FontAwesome } from "@expo/vector-icons";
import { Platform } from "react-native";
import { Text, View } from "tamagui";

interface ToastOptionsProps {
  iconName: string;
  iconSize?: number;
  iconColor?: string;
}

export const ToastOptions = ({
  iconName,
  iconSize = 20,
  iconColor = "lightgreen",
}: ToastOptionsProps): DefaultToastOptions => ({
  position: ToastPosition.TOP,
  disableShadow: true,
  // @ts-ignore
  icon: () => (
    <FontAwesome name={iconName as any} size={iconSize} color={iconColor} />
  ),
  customToast: (toast) => {
    return (
      <View
        backgroundColor="#0c1033b2"
        borderRadius={20}
        borderColor="#7007ac"
        borderWidth={Platform.OS === "web" ? 4 : 0}
        borderStyle={(Platform.OS === "web" ? "double" : "solid") as "solid"}
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
        gap="$3"
        padding={10}
      >
        <View
          alignItems="center"
          justifyContent="center"
          width={25}
          height={25}
          backgroundColor="#5800fcff"
          borderRadius={15}
          padding={3}
        >
          {
            // @ts-ignore
            toast.icon && typeof toast.icon === "function" && toast.icon()
          }
        </View>
        <Text color="white" fontSize="$3">
          {toast.message}
        </Text>
      </View>
    );
  },
  styles: {
    pressable: {
      top: Platform.OS === "web" ? 100 : 40,
      left: "auto",
      alignSelf: "flex-end",
      paddingRight: 10,
    },
  },
});
