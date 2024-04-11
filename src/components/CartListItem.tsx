import { FontAwesome } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { GetProps, Text, View } from "tamagui";
import { updateQuantity } from "../lib/features/cartSlice";
import { CartItem } from "../lib/types";
import Input from "./Input";
import RemoteImage from "./RemoteImage";

type CartListItemProps = {
  cartItem: CartItem;
};

const CartListItem = ({ cartItem }: CartListItemProps) => {
  const dispatch = useDispatch();
  const itemPrice = (
    cartItem.product[
      `${cartItem.size.toLowerCase()}_price` as keyof Pick<
        typeof cartItem.product,
        "s_price" | "m_price" | "l_price" | "xl_price"
      >
    ] * cartItem.quantity
  ).toFixed(2);

  return (
    <View {...styles.container}>
      <RemoteImage
        {...styles.image}
        path={cartItem.product.image}
        placeholderStyle={styles.image}
        resizeMode="contain"
      />

      <View flex={1}>
        <Text {...styles.title}>{cartItem.product.name}</Text>
        <View {...styles.subtitleContainer}>
          <Text {...styles.price}>${itemPrice}</Text>
          <Text color="$color10">Size: {cartItem.size}</Text>
        </View>
      </View>
      <View {...styles.quantitySelector}>
        <FontAwesome
          onPress={() =>
            dispatch(
              updateQuantity({ ...cartItem, quantity: cartItem.quantity - 1 }),
            )
          }
          name="minus"
          color="gray"
          style={{ padding: 5 }}
        />
        <Input
          width={50}
          padding={0}
          textAlign="center"
          inputMode="numeric"
          value={String(cartItem?.quantity)}
          onChangeText={(t) =>
            dispatch(
              updateQuantity({
                ...cartItem,
                quantity: !isNaN(parseFloat(t)) ? parseFloat(t) : 1,
              }),
            )
          }
        />
        <FontAwesome
          onPress={() =>
            dispatch(
              updateQuantity({ ...cartItem, quantity: cartItem.quantity + 1 }),
            )
          }
          name="plus"
          color="gray"
          style={{ padding: 5 }}
        />
      </View>
    </View>
  );
};

interface StyleTypes {
  container: GetProps<typeof View>;
  image: GetProps<typeof RemoteImage>;
  title: GetProps<typeof Text>;
  subtitleContainer: GetProps<typeof View>;
  quantitySelector: GetProps<typeof View>;
  quantity: GetProps<typeof Text>;
  price: GetProps<typeof Text>;
}

const styles: StyleTypes = {
  container: {
    borderRadius: 10,
    padding: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
  },
  image: {
    width: 75,
    height: 75,
    aspectRatio: 1,
    marginRight: 10,
  },
  title: {
    color: "$color",
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: "row",
    gap: 5,
  },
  quantitySelector: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  quantity: {
    fontWeight: "500",
    fontSize: 18,
  },
  price: {
    fontWeight: "bold",
    color: "$blue10",
  },
};

export default CartListItem;
