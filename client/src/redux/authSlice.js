import { createSlice } from "@reduxjs/toolkit";

let savedUser = null;

if (typeof window !== "undefined") {
  const raw = window.localStorage.getItem("ff-user");
  if (raw) {
    try {
      savedUser = JSON.parse(raw);
    } catch (err) {
      console.error("Auth localStorage parse error:", err);
      savedUser = null;
    }
  }
}

const initialState = {
  user: savedUser, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; 
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
