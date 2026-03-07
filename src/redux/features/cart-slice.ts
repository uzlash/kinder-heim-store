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
  /** Max quantity allowed (from product stock). Used to cap quantity in cart. */
  stock?: number;
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
      const { id, slug, title, price, quantity, discountedPrice, imgs, productOfMonth, stock } =
        action.payload;
      const existingItem = state.items.find((item) => sameProduct(item, action.payload));
      const maxQty = typeof stock === "number" ? Math.max(0, stock) : undefined;

      if (existingItem) {
        const added = maxQty != null ? Math.min(quantity, maxQty - existingItem.quantity) : quantity;
        existingItem.quantity += Math.max(0, added);
        if (maxQty != null) existingItem.stock = maxQty;
      } else {
        const qty = maxQty != null ? Math.min(quantity, maxQty) : quantity;
        state.items.push({
          id: slug ?? id,
          slug,
          title,
          price,
          quantity: Math.max(1, qty),
          discountedPrice,
          stock: maxQty,
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
        const maxQty = existingItem.stock;
        const clamped =
          maxQty != null ? Math.min(Math.max(1, quantity), maxQty) : Math.max(1, quantity);
        existingItem.quantity = clamped;
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
