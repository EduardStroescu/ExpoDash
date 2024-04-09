import { RootState } from "@/lib/reduxStore";
import { Href, Link, usePathname, useSegments } from "expo-router";
import { useColorScheme } from "react-native";
import {
  Button,
  GetProps,
  Separator,
  Text,
  Theme,
  View,
  XStack,
  useTheme,
} from "tamagui";
import { useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { UseThemeResult } from "@tamagui/web";

export default function Navbar() {
  const { isAdmin } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const { items } = useSelector((state: RootState) => state.cart);
  const cartItemsNumber = items.length;

  if (segments[0] === "(auth)") {
    return null;
  }

  if (isAdmin)
    return (
      <Theme name={colorScheme}>
        <AdminNavbar
          segments={segments}
          pathname={pathname}
          cartItemsNumber={cartItemsNumber}
        />
      </Theme>
    );

  return (
    <Theme name={colorScheme}>
      <UserNavbar pathname={pathname} cartItemsNumber={cartItemsNumber} />
    </Theme>
  );
}

function UserNavbar({
  pathname,
  cartItemsNumber,
}: {
  pathname: string;
  cartItemsNumber: number;
}) {
  const theme = useTheme();
  const routes = [
    { title: "Orders", href: "/user/orders", icon: null },
    { title: "Profile", href: "/user/profile", icon: null },
    {
      title: "Cart",
      href: "/user/menu/cart",
      icon: ({ color }: { color: string }) => (
        <View position="relative">
          <FontAwesome name="shopping-cart" size={25} color={color} />
          {cartItemsNumber > 0 && (
            <View
              alignItems="center"
              justifyContent="center"
              borderRadius={10}
              backgroundColor="red"
              width={20}
              height={20}
              position="absolute"
              right={-12}
              top={-10}
            >
              <Text color={color} fontSize={12}>
                {cartItemsNumber}
              </Text>
            </View>
          )}
        </View>
      ),
    },
  ];
  return (
    <XStack {...styles.primaryContainer}>
      <HomeLink />
      <XStack {...styles.linksContainer}>
        {routes.map((route) => {
          const isLinkActive = pathname
            .toLowerCase()
            .includes(route.title.toLowerCase());
          return (
            <Link href={route.href as Href<string>} key={route.href} asChild>
              <Button unstyled>
                {route.icon &&
                  route.icon({
                    color: isLinkActive ? theme.blue10.val : theme.color.val,
                  })}
                {route.title !== "Cart" && (
                  <Text
                    {...styles.mainLink}
                    color={isLinkActive ? theme.blue10.val : theme.color.val}
                  >
                    {route.title}
                  </Text>
                )}
              </Button>
            </Link>
          );
        })}
      </XStack>
    </XStack>
  );
}

function AdminNavbar({
  segments,
  pathname,
  cartItemsNumber,
}: {
  segments: string[];
  pathname: string;
  cartItemsNumber: number;
}) {
  const theme = useTheme();
  const routes = {
    default: [
      { title: "Admin", href: "/admin/", icon: null },
      { title: "User", href: "/user/", icon: null },
    ],
    user: [
      { title: "Orders", href: "/user/orders/", icon: null },
      { title: "Profile", href: "/user/profile", icon: null },
      {
        title: "Cart",
        href: "/user/menu/cart",
        icon: ({ color, theme }: { color: string; theme: UseThemeResult }) => (
          <View position="relative">
            <FontAwesome name="shopping-cart" size={25} color={color} />
            {cartItemsNumber > 0 && (
              <View
                alignItems="center"
                justifyContent="center"
                borderRadius={10}
                backgroundColor="red"
                width={20}
                height={20}
                position="absolute"
                right={-12}
                top={-10}
              >
                <Text color={theme.color.val} fontSize={12}>
                  {cartItemsNumber}
                </Text>
              </View>
            )}
          </View>
        ),
      },
    ],
    admin: [
      { title: "Orders", href: "/admin/orders/list", icon: null },
      { title: "Profile", href: "/admin/profile", icon: null },
    ],
  };

  const currentUserType =
    segments?.[0] === "admin" || segments?.[0] === "user"
      ? segments?.[0].replace(/[^\w\s]/gi, "")
      : "admin";

  return (
    <XStack {...styles.primaryContainer}>
      <XStack {...styles.linksContainer}>
        <HomeLink />
        <Separator alignSelf="stretch" vertical borderColor="$blue10" />
        {routes.default.map((route) => {
          const activeRoute = currentUserType === route.title.toLowerCase();

          return (
            <Link href={route.href as Href<string>} key={route.href} asChild>
              <Button unstyled>
                <Text
                  {...styles.secondaryLink}
                  color={activeRoute ? "$red10" : "$color"}
                >
                  {route.title}
                </Text>
              </Button>
            </Link>
          );
        })}
      </XStack>
      <XStack {...styles.linksContainer}>
        {routes[currentUserType as keyof typeof routes].map((route) => {
          const isLinkActive = pathname
            .toLowerCase()
            .includes(route.title?.toLowerCase());

          return (
            <Link href={route.href as Href<string>} key={route.href} asChild>
              <Button unstyled flexDirection="row" alignItems="center">
                {route.icon &&
                  route.icon({
                    color: isLinkActive ? theme.blue10.val : theme.color.val,
                    theme: theme,
                  })}
                {route.title !== "Cart" && (
                  <Text
                    {...styles.mainLink}
                    color={isLinkActive ? theme.blue10.val : theme.color.val}
                  >
                    {route.title}
                  </Text>
                )}
              </Button>
            </Link>
          );
        })}
      </XStack>
    </XStack>
  );
}

function HomeLink() {
  return (
    <Link href="/" asChild>
      <Button unstyled>
        <Text {...styles.mainLink} color="$color">
          ExpoDash
        </Text>
      </Button>
    </Link>
  );
}

interface StyleTypes {
  primaryContainer: GetProps<typeof XStack>;
  linksContainer: GetProps<typeof XStack>;
  mainLink: GetProps<typeof Text>;
  secondaryLink: GetProps<typeof Text>;
}

const styles: StyleTypes = {
  primaryContainer: {
    width: "100%",
    height: 60,
    overflow: "hidden",
    backgroundColor: "$background",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    $gtMd: {
      paddingHorizontal: 60,
    },
  },
  linksContainer: {
    alignItems: "center",
    gap: 10,
    $gtMd: { gap: 20 },
  },
  mainLink: {
    fontWeight: "600",
    fontSize: 14,
    hoverStyle: {
      color: "$blue10",
      fontStyle: "italic",
    },
    $gtMd: { fontSize: 16 },
  },
  secondaryLink: {
    fontSize: 12,
    hoverStyle: {
      color: "$red10",
      fontStyle: "italic",
    },
    $gtMd: { fontSize: 14 },
  },
};
