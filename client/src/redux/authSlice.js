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
     
        savedAuth = { user: parsed, token: null, isAdmin: false, role: null };
      }
    } catch (err) {
      console.error("Auth localStorage parse error:", err);
      savedAuth = null;
    }
  }
}

const migrateRole = (auth) => {
  if (!auth?.user) return null;

  if (auth.isAdmin) return "admin";

  if (!auth.role) return "staff";

  return auth.role;
};

const initialState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || null,
  isAdmin: savedAuth?.isAdmin || false,
  role: migrateRole(savedAuth),
};

const persistAuth = (state) => {
  if (typeof window === "undefined") return;

  const toSave = {
    user: state.user,
    token: state.token,
    role: state.role,
    isAdmin: state.isAdmin,
  };

  window.localStorage.setItem("ff-auth", JSON.stringify(toSave));
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, isAdmin, role } = action.payload;

      state.user = user || null;
      state.token = token || null;

      const finalRole = role || (isAdmin ? "admin" : state.role) || null;

      state.role = finalRole;
      state.isAdmin = finalRole === "admin";

      persistAuth(state);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAdmin = false;

      if (typeof window !== "undefined") {
        window.localStorage.removeItem("ff-auth");
        window.localStorage.removeItem("ff-user");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
