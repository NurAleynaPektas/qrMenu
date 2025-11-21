import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "ff-menu-items";

const defaultItems = [
  {
    id: "M-1",
    nameKey: "home.items.meatball",
    name: "Köfte Menü",
    price: 180,
    category: "Meals",
    available: true,
    img: "https://picsum.photos/400/250?food1",
  },
  {
    id: "M-2",
    nameKey: "home.items.ayran",
    name: "Ayran",
    price: 90,
    category: "Drinks",
    available: true,
    img: "https://picsum.photos/400/250?food2",
  },
  {
    id: "M-3",
    nameKey: "home.items.souffle",
    name: "Sufle",
    price: 60,
    category: "Desserts",
    available: true,
    img: "https://picsum.photos/400/250?food3",
  },
  {
    id: "M-4",
    nameKey: "home.items.lemonade",
    name: "Limonata",
    price: 35,
    category: "Drinks",
    available: true,
    img: "https://picsum.photos/400/250?drink",
  },
];

let persistedItems = [];
if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        persistedItems = parsed;
      }
    }
  } catch (err) {
    console.error("Menu localStorage parse error:", err);
  }
}

const initialState = {
  items: persistedItems.length > 0 ? persistedItems : defaultItems,
};

const saveToStorage = (items) => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch (err) {
    console.error("Menu localStorage save error:", err);
  }
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
        name,
        nameKey: nameKey || null,
        price,
        category,
        available,
        img:
          img ||
          `https://picsum.photos/400/250?random=${state.items.length + 1}`,
      });

      saveToStorage(state.items);
    },

    updateMenuItem: (state, action) => {
      const { id, changes } = action.payload;
      const item = state.items.find((it) => it.id === id);
      if (!item) return;

      Object.assign(item, changes);
      saveToStorage(state.items);
    },

    deleteMenuItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((it) => it.id !== id);
      saveToStorage(state.items);
    },
  },
});

export const { addMenuItem, updateMenuItem, deleteMenuItem } =
  menuSlice.actions;

export default menuSlice.reducer;
