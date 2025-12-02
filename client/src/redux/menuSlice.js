import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/menu`;


const resolveImageUrl = (img, fallbackRandomKey = "1") => {

  if (!img) {
    return `https://picsum.photos/400/250?random=${fallbackRandomKey}`;
  }

  let url = String(img);

  if (url.startsWith("http://localhost:5000")) {
    return url.replace("http://localhost:5000", API_BASE);
  }


  if (url.startsWith("/uploads/")) {
    return `${API_BASE}${url}`;
  }


  if (!url.startsWith("http")) {
    return `${API_BASE}/uploads/${url}`;
  }

  
  return url;
};

// Eski kategorileri (ANA YEMEK, İÇECEK...)
const mapLegacyCategory = (cat) => {
  if (!cat) return "OTHER";

  const val = String(cat).toUpperCase();

  switch (val) {
    case "ANA YEMEK":
    case "MAIN":
      return "MAIN";

    case "İÇECEK":
    case "ICECEK":
    case "DRINK":
      return "DRINK";

    case "APERATİF":
    case "APERATIF":
    case "APPETIZER":
      return "APPETIZER";

    case "TATLI":
    case "DESSERT":
      return "DESSERT";

    default:
      return val; // bilinmeyen bir şeyse dokunma, büyük harf olarak bırak
  }
};

// MENÜYÜ ÇEK
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

// MENÜ ITEM EKLE
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

// MENÜ ITEM GÜNCELLE
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

// MENÜ ITEM SİL
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
          category: mapLegacyCategory(item.category),
          available:
            typeof item.available === "boolean" ? item.available : true,
          img: resolveImageUrl(item.img, `from-api-${idx + 1}`),
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
          category: mapLegacyCategory(item.category),
          available:
            typeof item.available === "boolean" ? item.available : true,
          img: resolveImageUrl(
            item.img,
            state.items.length + 1 // fallback için
          ),
        });
      })

      // ÜRÜN GÜNCELLE
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((it) => it.id === updated.id);
        if (index !== -1) {
          const prev = state.items[index];
          state.items[index] = {
            ...prev,
            ...updated,
            price: Number(updated.price ?? prev.price),
            category: mapLegacyCategory(
              updated.category !== undefined ? updated.category : prev.category
            ),
            img: resolveImageUrl(updated.img ?? prev.img, updated.id || "1"),
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
