import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const initialState = {
  screenshots: [],
  currentScreenshot: null,
  isLoading: false,
  error: null,
};

// Create Screenshot
export const createScreenshot = createAsyncThunk(
  "screenshot/create",
  async ({ id, screenshotData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/screenshot/create/${id}`,
        screenshotData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Creation failed" }
      );
    }
  }
);

// Fetch All Screenshots
export const fetchScreenshots = createAsyncThunk(
  "screenshot/fetchAll",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/screenshot/get-all/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Fetch failed" });
    }
  }
);

// Fetch Screenshot by ID
export const fetchScreenshotById = createAsyncThunk(
  "screenshot/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/screenshot/get/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Fetch failed" });
    }
  }
);

// Update Screenshot
export const updateScreenshot = createAsyncThunk(
  "screenshot/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/screenshot/update/${id}`, updates);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Update failed" }
      );
    }
  }
);

// Delete Screenshot
export const deleteScreenshot = createAsyncThunk(
  "screenshot/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/screenshot/delete/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Deletion failed" }
      );
    }
  }
);

const screenshotSlice = createSlice({
  name: "screenshot",
  initialState,
  reducers: {
    clearScreenshotState: (state) => {
      state.screenshots = [];
      state.currentScreenshot = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Create
      .addCase(createScreenshot.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createScreenshot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.screenshots.push(action.payload.screenshot);
      })
      .addCase(createScreenshot.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // Fetch All
      .addCase(fetchScreenshots.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchScreenshots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.screenshots = action.payload.screenshots;
      })
      .addCase(fetchScreenshots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // Fetch One
      .addCase(fetchScreenshotById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchScreenshotById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentScreenshot = action.payload.screenshot;
      })
      .addCase(fetchScreenshotById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // Update
      .addCase(updateScreenshot.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateScreenshot.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.screenshots.findIndex(
          (s) => s._id === action.payload._id
        );
        if (idx !== -1) state.screenshots[idx] = action.payload;
        if (
          state.currentScreenshot &&
          state.currentScreenshot._id === action.payload._id
        ) {
          state.currentScreenshot = action.payload.screenshot;
        }
      })
      .addCase(updateScreenshot.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // Delete
      .addCase(deleteScreenshot.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteScreenshot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.screenshots = state.screenshots.filter(
          (s) => s._id !== action.meta.arg
        );
      })
      .addCase(deleteScreenshot.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearScreenshotState } = screenshotSlice.actions;

export default screenshotSlice.reducer;
