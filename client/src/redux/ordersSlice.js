import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/orders`;

// GET /api/orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_URL);
      return res.data || [];
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to load orders";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// PATCH /api/orders/:id/status
export const patchOrderStatus = createAsyncThunk(
  "orders/patchOrderStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}/status`, { status });
      // res: { message, order }
      return res.data?.order;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update order status";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
  updatingId: null, 
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load orders";
      })

      // PATCH STATUS
      .addCase(patchOrderStatus.pending, (state, action) => {
        state.error = null;
        state.updatingId = action.meta.arg?.id || null;
      })
      .addCase(patchOrderStatus.fulfilled, (state, action) => {
        state.updatingId = null;
        const updated = action.payload;
        if (!updated?.id) return;

        const idx = state.list.findIndex((o) => o.id === updated.id);
        if (idx !== -1) {
          state.list[idx] = { ...state.list[idx], ...updated };
        }
      })
      .addCase(patchOrderStatus.rejected, (state, action) => {
        state.updatingId = null;
        state.error = action.payload || "Failed to update order status";
      });
  },
});

export default ordersSlice.reducer;
