import { createSlice } from "@reduxjs/toolkit";

let savedMenu = null;

// LocalStorage'dan menüyü yükle (varsa)
if (typeof window !== "undefined") {
  const raw = window.localStorage.getItem("ff-menu");
  if (raw) {
    try {
      savedMenu = JSON.parse(raw);
    } catch (e) {
      console.error("Menu localStorage parse error:", e);
      savedMenu = null;
    }
  }
}

// Varsayılan menü elemanları (i18n key'leri ile)
const defaultMenuItems = [
  {
    id: "M-1",
    nameKey: "home.items.meatball", // i18n key
    name: "Meatball Menu", // fallback / admin panel için
    price: 270,
    img: "https://picsum.photos/400/250?food1",
    category: "meals",
    available: true,
  },
  {
    id: "M-2",
    nameKey: "home.items.ayran",
    name: "Ayran",
    price: 90,
    img: "https://picsum.photos/400/250?food2",
    category: "drinks",
    available: true,
  },
  {
    id: "M-3",
    nameKey: "home.items.souffle",
    name: "Soufflé",
    price: 105,
    img: "https://picsum.photos/400/250?food3",
    category: "desserts",
    available: true,
  },
  {
    id: "M-4",
    nameKey: "home.items.lemonade",
    name: "Lemonade",
    price: 35,
    img: "https://picsum.photos/400/250?drink",
    category: "drinks",
    available: false,
  },
];

const initialState = {
  // Eğer localStorage'da kayıt varsa onu kullan, yoksa default liste
  items:
    Array.isArray(savedMenu) && savedMenu.length > 0
      ? savedMenu
      : defaultMenuItems,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    // Yeni ürün ekle (Admin panelden)
    addMenuItem: (state, action) => {
      const data = action.payload;

      const newItem = {
        id:
          data.id ||
          "M-" + (state.items.length + 1 + Math.floor(Math.random() * 90)),
        nameKey: data.nameKey || null, // admin eklediği için genelde null
        name: data.name,
        price: Number(data.price),
        category: data.category || "Genel",
        img: data.img || `https://picsum.photos/400/250?random=${Date.now()}`, // şimdilik placeholder
        available: data.available ?? true,
      };

      state.items.push(newItem);
    },

    // Ürün güncelle
    updateMenuItem: (state, action) => {
      const { id, changes } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;

      // Gelen değişiklikleri mevcut item üzerine yaz
      if (typeof changes.name === "string") {
        item.name = changes.name;
      }
      if (changes.price != null) {
        item.price = Number(changes.price);
      }
      if (typeof changes.category === "string") {
        item.category = changes.category;
      }
      if (typeof changes.available === "boolean") {
        item.available = changes.available;
      }
    },

    // Ürün sil
    deleteMenuItem: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
    },
  },
});

export const { addMenuItem, updateMenuItem, deleteMenuItem } =
  menuSlice.actions;

export default menuSlice.reducer;
