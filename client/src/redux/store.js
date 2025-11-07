// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});


if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();
    window.localStorage.setItem("ff-cart", JSON.stringify(state.cart.items));
  });
}
