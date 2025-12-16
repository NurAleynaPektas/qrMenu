import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/orders`;

// GET
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(API_URL);
      return res.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load orders"
      );
    }
  }
);

// PATCH status
export const patchOrderStatus = createAsyncThunk(
  "orders/patchOrderStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}/status`, { status });
      return res.data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

//  aynı data mı kontrol
function isSameOrders(a = [], b = []) {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (
      a[i].id !== b[i].id ||
      a[i].status !== b[i].status ||
      a[i].updatedAt !== b[i].updatedAt
    ) {
      return false;
    }
  }
  return true;
}

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

        //  KRİTİK NOKTA
        if (!isSameOrders(state.list, action.payload)) {
          state.list = action.payload;
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PATCH
      .addCase(patchOrderStatus.pending, (state, action) => {
        state.updatingId = action.meta.arg.id;
      })
      .addCase(patchOrderStatus.fulfilled, (state, action) => {
        state.updatingId = null;
        const updated = action.payload;
        const idx = state.list.findIndex((o) => o.id === updated.id);
        if (idx !== -1) {
          state.list[idx] = { ...state.list[idx], ...updated };
        }
      })
      .addCase(patchOrderStatus.rejected, (state) => {
        state.updatingId = null;
      });
  },
});

export default ordersSlice.reducer;
