import { RootState } from "@/lib/reduxStore";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useSegments } from "expo-router";
import { useColorScheme, Pressable, ColorSchemeName } from "react-native";
import { useSelector } from "react-redux";
import { Separator, Text, Theme, View, XStack, useTheme } from "tamagui";

export const headerIcons = {
  menu: "cutlery",
  orders: "list",
  profile: "user",
  cart: "cart",
};

export default function Header({ slug }: { slug?: number }) {
  const { isAdmin } = useSelector((state: RootState) => state.auth);
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const theme = useTheme();

  const shouldDisplayHeaderAction =
    (segments[0] === "(admin)" && segments[1] === "menu") ||
    segments[1] === "[id]";
  const headerTitle =
    (segments[1] &&
      segments[1]?.charAt(0).toUpperCase() + segments[1]?.slice(1)) ||
    (segments[0] &&
      segments[0]?.charAt(0).toUpperCase() + segments[0]?.slice(1));

  const shouldDisplayViewSwitch =
    isAdmin && (segments[2] === "list" || segments[3] === "archive");

  return (
    <Theme name={colorScheme}>
      <View {...styles.container} borderBlockColor="$color">
        <XStack alignItems="center" gap="$3">
          <FontAwesome
            name={
              headerIcons[
                headerTitle?.toLowerCase() as keyof typeof headerIcons
              ]
            }
            size={20}
            color={theme.red10.val}
            style={{ transform: [{ translateY: 1 }] }}
          />
          <Text {...styles.text} fontWeight="bold">
            {headerTitle}
          </Text>
        </XStack>
        {shouldDisplayHeaderAction && (
          <Link
            href={
              slug ? `/(admin)/menu/create?id=${slug}` : "/(admin)/menu/create"
            }
            asChild
          >
            <Pressable>
              {({ pressed }) => (
                <XStack
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  gap="$3"
                >
                  <FontAwesome
                    name={!slug ? "plus" : "pencil"}
                    size={25}
                    color={theme.blue10.val}
                    style={{
                      opacity: pressed ? 0.5 : 1,
                      transform: [{ translateY: 1 }],
                    }}
                  />
                  <Text
                    {...styles.text}
                    color="$blue10"
                    opacity={pressed ? 0.5 : 1}
                  >
                    {!slug ? "Create" : "Edit"}
                  </Text>
                </XStack>
              )}
            </Pressable>
          </Link>
        )}
        {shouldDisplayViewSwitch && (
          <ViewSwitcher colorScheme={colorScheme} segments={segments} />
        )}
      </View>
    </Theme>
  );
}

function ViewSwitcher({
  segments,
}: {
  colorScheme: ColorSchemeName;
  segments: string[];
}) {
  const isArchive = segments[2] === "list" && segments[3] === "archive";
  const isActive = segments[2] === "list" && segments[3] !== "archive";

  return (
    <View {...styles.displayViewSwitch}>
      <Link href="/(admin)/orders/list" asChild>
        <Pressable>
          <Text {...styles.switcherText} color={isActive ? "$red10" : "$color"}>
            Active
          </Text>
        </Pressable>
      </Link>
      <Separator alignSelf="stretch" vertical borderColor="$blue10" />

      <Link href="/(admin)/orders/list/archive" asChild>
        <Pressable>
          <Text
            {...styles.switcherText}
            color={isArchive ? "$red10" : "$color"}
          >
            Archive
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = {
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 0.3,
    $gtMd: {
      paddingHorizontal: 50,
    },
  },
  text: {
    fontSize: 22,
    color: "$blue10",
  },
  displayViewSwitch: {
    flexDirection: "row",
    gap: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  switcherText: {
    fontSize: 20,
  },
};
