import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQty: (state, action) => {
      const item = state.items.find((it) => it.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQty: (state, action) => {
      const item = state.items.find((it) => it.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
  },
});

export const { addToCart, removeFromCart, increaseQty, decreaseQty } =
  cartSlice.actions;

export default cartSlice.reducer;
