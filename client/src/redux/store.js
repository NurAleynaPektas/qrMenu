import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import menuReducer from "./menuSlice";
import ordersReducer from "./ordersSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    menu: menuReducer,
    orders: ordersReducer, 
  },
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();

    window.localStorage.setItem("ff-cart", JSON.stringify(state.cart.items));

    window.localStorage.setItem(
      "ff-auth",
      JSON.stringify({
        user: state.auth.user,
        token: state.auth.token,
        role: state.auth.role,
        isAdmin: state.auth.isAdmin,
      })
    );
  });
}
