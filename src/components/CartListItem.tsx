import { View, Text, StyleSheet, useColorScheme } from "react-native";
import React from "react";
import Colors from "../lib/constants/Colors";
import { CartItem } from "../lib/types";
import { FontAwesome } from "@expo/vector-icons";
import { defaultPizzaImage } from "@assets/data/products";
import { useDispatch } from "react-redux";
import { updateQuantity } from "../lib/features/cartSlice";
import RemoteImage from "./RemoteImage";

type CartListItemProps = {
  cartItem: CartItem;
};

const CartListItem = ({ cartItem }: CartListItemProps) => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].foreground },
      ]}
    >
      <RemoteImage
        path={cartItem.product.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={{ flex: 1 }}>
        <Text
          style={[styles.title, { color: Colors[colorScheme ?? "light"].text }]}
        >
          {cartItem.product.name}
        </Text>
        <View style={styles.subtitleContainer}>
          <Text
            style={[
              styles.price,
              { color: Colors[colorScheme ?? "light"].tint },
            ]}
          >
            ${cartItem.product.price.toFixed(2)}
          </Text>
          <Text style={{ color: Colors[colorScheme ?? "light"].subText }}>
            Size: {cartItem.size}
          </Text>
        </View>
      </View>
      <View style={styles.quantitySelector}>
        <FontAwesome
          onPress={() =>
            dispatch(
              updateQuantity({ ...cartItem, quantity: cartItem.quantity - 1 })
            )
          }
          name="minus"
          color="gray"
          style={{ padding: 5 }}
        />

        <Text
          style={[
            styles.quantity,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
        >
          {cartItem.quantity}
        </Text>
        <FontAwesome
          onPress={() =>
            dispatch(
              updateQuantity({ ...cartItem, quantity: cartItem.quantity + 1 })
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

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 75,
    aspectRatio: 1,
    alignSelf: "center",
    marginRight: 10,
  },
  title: {
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
  },
});

export default CartListItem;
