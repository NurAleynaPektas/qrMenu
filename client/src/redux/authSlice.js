import { createSlice } from "@reduxjs/toolkit";

let savedAuth = null;

if (typeof window !== "undefined") {
  const raw =
    window.localStorage.getItem("ff-auth") ||
    window.localStorage.getItem("ff-user");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user !== undefined) {
        savedAuth = parsed;
      } else {
        savedAuth = { user: parsed, token: null, isAdmin: false };
      }
    } catch (err) {
      console.error("Auth localStorage parse error:", err);
      savedAuth = null;
    }
  }
}

const initialState = {
  user: savedAuth?.user || null, 
  token: savedAuth?.token || null, 
  isAdmin: savedAuth?.isAdmin || false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, isAdmin } = action.payload;
      state.user = user || null;
      state.token = token || null;
      state.isAdmin = !!isAdmin;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAdmin = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
