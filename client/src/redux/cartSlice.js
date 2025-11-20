import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "ff-cart";

function loadCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
  }
}

const initialState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { id, title, price, img, nameKey } = action.payload;
      const existing = state.items.find((it) => it.id === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          id,
          title,
          price,
          img,
          nameKey: nameKey || null,
          quantity: 1,
        });
      }

      saveCart(state.items);
    },
    increaseQty(state, action) {
      const id = action.payload;
      const item = state.items.find((it) => it.id === id);
      if (item) {
        item.quantity += 1;
        saveCart(state.items);
      }
    },
    decreaseQty(state, action) {
      const id = action.payload;
      const item = state.items.find((it) => it.id === id);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
        saveCart(state.items);
      } else {
        state.items = state.items.filter((it) => it.id !== id);
        saveCart(state.items);
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((it) => it.id !== id);
      saveCart(state.items);
    },
    
    clearCart(state) {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart, 
} = cartSlice.actions;

export default cartSlice.reducer;
