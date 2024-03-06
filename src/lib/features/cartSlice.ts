import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartItem } from "../types";

export interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { product, size, quantity } = action.payload;
      const alreadyInCartIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (alreadyInCartIndex !== -1) {
        state.items[alreadyInCartIndex].quantity += quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      const idToRemove = action.payload.id;
      const indexToRemove = state.items.findIndex(
        (item) => item.id === idToRemove
      );
      if (indexToRemove !== -1) {
        state.items.splice(indexToRemove, 1);
      }
    },
    updateQuantity: (state, action: PayloadAction<CartItem>) => {
      const { id, size, quantity } = action.payload;
      const alreadyInCartIndex = state.items.findIndex(
        (item) => item.id === id && item.size === size
      );
      if (alreadyInCartIndex !== -1) {
        if (quantity > 0) {
          state.items[alreadyInCartIndex].quantity = quantity;
        } else {
          state.items.splice(alreadyInCartIndex, 1);
        }
      }
    },
    getCartTotal: (state): void => {
      state.total = state.items.reduce(
        (sum, item) => (sum += item.product.price * item.quantity),
        0
      );
    },
    clearCart: (state): void => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCartTotal,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
