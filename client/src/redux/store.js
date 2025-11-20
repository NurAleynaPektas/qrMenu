import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import menuReducer from "./menuSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    menu: menuReducer, 
  },
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();

    // Cart
    window.localStorage.setItem("ff-cart", JSON.stringify(state.cart.items));

    // Auth
    window.localStorage.setItem(
      "ff-auth",
      JSON.stringify({
        user: state.auth.user,
        token: state.auth.token,
        isAdmin: state.auth.isAdmin,
      })
    );

    // Menu
    window.localStorage.setItem("ff-menu", JSON.stringify(state.menu.items));
  });
}
