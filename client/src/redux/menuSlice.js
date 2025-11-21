import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Backend endpoint
const API_URL = `${import.meta.env.VITE_API_URL}/api/menu`;


// Menüleri backend'den çek
export const fetchMenu = createAsyncThunk(
  "menu/fetchMenu",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to load menu";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    addMenuItem: (state, action) => {
      const {
        id,
        name,
        price,
        category,
        available = true,
        img,
        nameKey,
      } = action.payload;

      const newId =
        id || `M-${state.items.length + 1}-${Math.floor(Math.random() * 9999)}`;

      state.items.push({
        id: newId,
        name: name || "Menu item",
        nameKey: nameKey || null,
        price: Number(price) || 0,
        category: category || "General",
        available,
        img:
          img ||
          `https://picsum.photos/400/250?random=${state.items.length + 1}`,
      });
    },
    updateMenuItem: (state, action) => {
      const { id, changes } = action.payload;
      const item = state.items.find((it) => it.id === id);
      if (!item) return;

      Object.assign(item, changes);
    },
    deleteMenuItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((it) => it.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = (action.payload || []).map((item, idx) => ({
          id: item.id || `M-${idx + 1}`,
          name: item.name || "Menu item",
          nameKey: item.nameKey || null,
          price: Number(item.price) || 0,
          category: item.category || "General",
          available:
            typeof item.available === "boolean" ? item.available : true,
          img:
            item.img ||
            `https://picsum.photos/400/250?random=from-api-${idx + 1}`,
        }));
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load menu";
      });
  },
});

export const { addMenuItem, updateMenuItem, deleteMenuItem } =
  menuSlice.actions;

export default menuSlice.reducer;
