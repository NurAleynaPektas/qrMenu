import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();
    window.localStorage.setItem("ff-cart", JSON.stringify(state.cart.items));
    window.localStorage.setItem("ff-user", JSON.stringify(state.auth.user));
  });
}
