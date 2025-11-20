import { createSlice } from "@reduxjs/toolkit";

// LocalStorage'tan varsa menüyü oku
let savedMenu = null;

if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem("ff-menu");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        savedMenu = parsed;
      }
    }
  } catch (err) {
    console.error("Menu localStorage parse error:", err);
  }
}

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

const initialState = {
  // Eğer localStorage'ta menü varsa onu kullan, yoksa default listeyi
  items: savedMenu || defaultItems,
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
});

export const { addMenuItem, updateMenuItem, deleteMenuItem } =
  menuSlice.actions;

export default menuSlice.reducer;
