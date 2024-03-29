import { RootState } from "@/lib/reduxStore";
import { Link, usePathname, useSegments } from "expo-router";
import { ColorSchemeName, Pressable, useColorScheme } from "react-native";
import { Separator, Text, Theme, XStack } from "tamagui";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { isAdmin } = useSelector((state: RootState) => state.auth);
  const segments = useSegments();
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  if (isAdmin)
    return (
      <Theme name={colorScheme}>
        <AdminNavbar
          segments={segments}
          pathname={pathname}
          colorScheme={colorScheme}
        />
      </Theme>
    );

  return (
    <Theme name={colorScheme}>
      <UserNavbar pathname={pathname} colorScheme={colorScheme} />
    </Theme>
  );
}

function UserNavbar({ pathname }: { pathname: string }) {
  const routes = [
    { title: "Menu", href: "/(user)/menu" },
    { title: "Orders", href: "/(user)/orders" },
    { title: "Profile", href: "/profile" },
    { title: "Cart", href: "/(user)/menu/cart" },
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
            <Link href={route.href} key={route.title} asChild>
              <Pressable>
                <Text
                  {...styles.mainLink}
                  color={isLinkActive ? "$blue10" : "$color"}
                >
                  {route.title}
                </Text>
              </Pressable>
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
}: {
  segments: string[];
  pathname: string;
}) {
  const routes = {
    default: [
      { title: "Admin", href: "/(admin)/menu" },
      { title: "User", href: "/(user)/menu" },
    ],
    user: [
      { title: "Orders", href: "/(user)/orders" },
      { title: "Profile", href: "/(user)/profile" },
      { title: "Cart", href: "/(user)/menu/cart" },
    ],
    admin: [
      { title: "Orders", href: "/(admin)/orders" },
      { title: "Profile", href: "/(admin)/profile" },
    ],
  };

  const currentUserType =
    segments[0] === "(admin)" || segments[0] === "(user)"
      ? (segments[0].slice(1, -1) as keyof typeof routes)
      : "admin";

  return (
    <XStack {...styles.primaryContainer}>
      <XStack {...styles.linksContainer}>
        <HomeLink />
        <Separator alignSelf="stretch" vertical borderColor="$blue10" />
        {routes.default.map((route) => {
          const activeRoute =
            segments[0] &&
            segments[0].slice(1, -1) === route.title.toLowerCase();

          return (
            <Link href={route.href} key={route.title} asChild>
              <Pressable>
                <Text
                  {...styles.secondaryLink}
                  color={activeRoute ? "$red10" : "$color"}
                >
                  {route.title}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </XStack>
      <XStack {...styles.linksContainer}>
        {routes[currentUserType as keyof typeof routes].map((route) => {
          const isLinkActive = pathname
            .toLowerCase()
            .includes(route.title.toLowerCase());

          return (
            <Link href={route.href} key={route.title} asChild>
              <Pressable>
                <Text
                  {...styles.mainLink}
                  color={isLinkActive ? "$blue10" : "$color"}
                >
                  {route.title}
                </Text>
              </Pressable>
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
      <Pressable>
        <Text {...styles.mainLink} color="$color">
          Home
        </Text>
      </Pressable>
    </Link>
  );
}

interface StyleProps {
  primaryContainer: React.PropsWithoutRef<typeof XStack>;
  linksContainer: React.PropsWithoutRef<typeof XStack>;
  mainLink: React.PropsWithoutRef<typeof Text>;
  secondaryLink: React.PropsWithoutRef<typeof Text>;
}

const styles: StyleProps = {
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
