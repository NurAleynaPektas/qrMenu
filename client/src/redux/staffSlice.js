import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/staff`;

const withAuth = (getState) => {
  const state = getState();
  const token = state?.auth?.token || state?.auth?.user?.token;

  if (!token) return {};
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, withAuth(getState));
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Staff listesi alınamadı";
      return rejectWithValue(msg);
    }
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async (id, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, withAuth(getState));
      return id;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Personel silinemedi";
      return rejectWithValue(msg);
    }
  }
);


export const patchStaffActive = createAsyncThunk(
  "staff/patchStaffActive",
  async ({ id, active }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${API_URL}/${id}`,
        { active },
        withAuth(getState)
      );
      return res.data; 
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Personel güncellenemedi";
      return rejectWithValue(msg);
    }
  }
);

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearStaffError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Staff listesi alınamadı";
      })

      // delete
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (s) => (s.id || s._id) !== action.payload
        );
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.error = action.payload || "Personel silinemedi";
      })

      // patch active
      .addCase(patchStaffActive.fulfilled, (state, action) => {
        const updated = action.payload;
        const updatedId = updated?.id || updated?._id;
        const idx = state.items.findIndex((s) => (s.id || s._id) === updatedId);
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(patchStaffActive.rejected, (state, action) => {
        state.error = action.payload || "Personel güncellenemedi";
      });
  },
});

export const { clearStaffError } = staffSlice.actions;
export default staffSlice.reducer;
