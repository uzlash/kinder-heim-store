import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
};

export type CartItem = {
  id: string | number;
  slug?: string;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  productOfMonth?: boolean;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

const initialState: InitialState = {
  items: [],
};

/** Stable key for "same product": prefer slug, fallback to id */
function sameProduct(a: CartItem, payload: CartItem): boolean {
  if (a.slug && payload.slug && a.slug === payload.slug) return true;
  return a.id === payload.id;
}

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, slug, title, price, quantity, discountedPrice, imgs, productOfMonth } =
        action.payload;
      const existingItem = state.items.find((item) => sameProduct(item, action.payload));

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: slug ?? id,
          slug,
          title,
          price,
          quantity,
          discountedPrice,
          productOfMonth,
          imgs,
        });
      }
    },
    removeItemFromCart: (state, action: PayloadAction<string | number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string | number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;
export default cart.reducer;
