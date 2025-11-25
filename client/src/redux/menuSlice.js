import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = `${import.meta.env.VITE_API_URL}/api/menu`;


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

// YENİ: Menü item ekle (POST /api/menu)
export const addMenuItem = createAsyncThunk(
  "menu/addMenuItem",
  async (payload, thunkAPI) => {
    try {
      const res = await axios.post(API_URL, payload);
      return res.data; 
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to add menu item";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// YENİ: Menü item güncelle (PUT /api/menu/:id)
export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async ({ id, changes }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, changes);
      return res.data; 
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update menu item";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// YENİ: Menü item sil 
export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id, thunkAPI) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      return res.data.id || id;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete menu item";
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
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      // MENÜYÜ ÇEK
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
      })

      // YENİ ÜRÜN EKLE
      .addCase(addMenuItem.fulfilled, (state, action) => {
        const item = action.payload;
        state.items.push({
          id: item.id,
          name: item.name || "Menu item",
          nameKey: item.nameKey || null,
          price: Number(item.price) || 0,
          category: item.category || "General",
          available:
            typeof item.available === "boolean" ? item.available : true,
          img:
            item.img ||
            `https://picsum.photos/400/250?random=${state.items.length + 1}`,
        });
      })

      // ÜRÜN GÜNCELLE
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((it) => it.id === updated.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...updated,
            price: Number(updated.price ?? state.items[index].price),
          };
        }
      })

      // ÜRÜN SİL
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((it) => it.id !== id);
      });
  },
});

export default menuSlice.reducer;
