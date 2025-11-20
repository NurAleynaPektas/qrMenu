import { createSlice, nanoid } from "@reduxjs/toolkit";

const STORAGE_KEY = "ff-orders";

const defaultOrders = [
  {
    id: "ORD-101",
    table: 5,
    items: "Köfte Menü x2, Ayran x2",
    total: 540,
    status: "pending",
    time: "12:34",
    note: "",
  },
  {
    id: "ORD-102",
    table: 3,
    items: "Klasik Burger x1, Limonata x1",
    total: 220,
    status: "preparing",
    time: "12:40",
    note: "",
  },
  {
    id: "ORD-103",
    table: 1,
    items: "Sufle x2, Ayran x1",
    total: 210,
    status: "completed",
    time: "12:10",
    note: "",
  },
  {
    id: "ORD-104",
    table: 7,
    items: "Köfte Menü x1, Limonata x2",
    total: 250,
    status: "pending",
    time: "12:45",
    note: "",
  },
];

function loadOrders() {
  if (typeof window === "undefined") return defaultOrders;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultOrders;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultOrders;
  } catch {
    return defaultOrders;
  }
}

function saveOrders(list) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
  }
}

const initialState = {
  list: loadOrders(),
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: {
      reducer(state, action) {
        state.list.unshift(action.payload);
        saveOrders(state.list);
      },
      prepare({ tableNumber, note, items, total }) {
        const id = `ORD-${nanoid(6)}`;
        const time = new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          payload: {
            id,
            table: tableNumber,
            items, 
            total,
            status: "pending",
            time,
            note: note || "",
          },
        };
      },
    },
    updateOrderStatus(state, action) {
      const { id, status } = action.payload;
      const order = state.list.find((o) => o.id === id);
      if (order) {
        order.status = status;
        saveOrders(state.list);
      }
    },
  },
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
