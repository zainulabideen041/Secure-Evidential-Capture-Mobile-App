import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const initialState = {
  cases: [],
  currentCase: null,
  loading: false,
  error: null,
};

// 1. Create a case
export const createCase = createAsyncThunk(
  "case/createCase",
  async ({ userId, caseData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/case/create/${userId}`, caseData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Create failed" }
      );
    }
  }
);

// 2. Get all cases for a user
export const fetchCases = createAsyncThunk(
  "case/fetchCases",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/case/get-all/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Fetch failed" });
    }
  }
);

// 3. Get a specific case by ID
export const fetchCaseById = createAsyncThunk(
  "case/fetchCaseById",
  async (caseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/case/get/${caseId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Fetch failed" });
    }
  }
);

// 4. Delete a case
export const deleteCase = createAsyncThunk(
  "case/deleteCase",
  async (caseId, { rejectWithValue }) => {
    try {
      await axios.delete(`/case/delete/${caseId}`);
      return caseId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Delete failed" }
      );
    }
  }
);

// Slice
const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    clearCurrentCase: (state) => {
      state.currentCase = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCase.fulfilled, (state, action) => {
        state.loading = false;
        state.cases.push(action.payload.case);
      })
      .addCase(createCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch All
      .addCase(fetchCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.loading = false;
        state.cases = action.payload.cases;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch by ID
      .addCase(fetchCaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCase = action.payload.case;
      })
      .addCase(fetchCaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete
      .addCase(deleteCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCase.fulfilled, (state, action) => {
        state.loading = false;
        state.cases = state.cases.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearCurrentCase } = caseSlice.actions;
export default caseSlice.reducer;
