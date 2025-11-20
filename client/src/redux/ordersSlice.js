import { createSlice, nanoid } from "@reduxjs/toolkit";

let savedOrders = [];
if (typeof window !== "undefined") {
  const raw = window.localStorage.getItem("ff-orders");
  if (raw) {
    try {
      savedOrders = JSON.parse(raw) || [];
    } catch {
      savedOrders = [];
    }
  }
}

const initialState = {
  list: savedOrders,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: {
      reducer(state, action) {
        state.list.unshift(action.payload);
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
      }
    },
  },
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
