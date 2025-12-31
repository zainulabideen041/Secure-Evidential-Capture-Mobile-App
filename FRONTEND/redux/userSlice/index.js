import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const initialState = {
  pendingUsers: [],
  approvedUsers: [],
  userDetails: null,
  isLoading: false,
  error: null,
};

// Get all pending requests
export const getPendingRequests = createAsyncThunk(
  "user/getPendingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`user/pendings`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: err.message || "Failed to fetch pending requests",
        }
      );
    }
  }
);

// Get all approved users
export const getApprovedUsers = createAsyncThunk(
  "user/getApprovedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`user/approved`);
      return response.data.approvedUsers;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: err.message || "Failed to fetch approved users",
        }
      );
    }
  }
);

// Approve or reject a user
export const approveUser = createAsyncThunk(
  "user/approveUser",
  async ({ approve, email }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`user/approve`, {
        approved: approve,
        email,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Approval failed" }
      );
    }
  }
);

// Delete all pending users with account_status = notverified
export const deleteAllPendings = createAsyncThunk(
  "user/deleteAllPendings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`user/del-pending-all`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Delete failed" }
      );
    }
  }
);

// Delete all users with email_status = notverified
export const deleteAllUnverified = createAsyncThunk(
  "user/deleteAllUnverified",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`user/del-all-unverified`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Delete failed" }
      );
    }
  }
);

//GET USER DETAILS
export const getUserDetails = createAsyncThunk(
  "user/details",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`user/details/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get pending users
      .addCase(getPendingRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingUsers = action.payload.pendingUsers;
      })
      .addCase(getPendingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Get approved users
      .addCase(getApprovedUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getApprovedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvedUsers = action.payload.approvedUsers;
      })
      .addCase(getApprovedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Get user details
      .addCase(getUserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.user;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Approve user
      .addCase(approveUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(approveUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Delete all pendings
      .addCase(deleteAllPendings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAllPendings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingUsers = []; // clear from state
      })
      .addCase(deleteAllPendings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Delete all unverified
      .addCase(deleteAllUnverified.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAllUnverified.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteAllUnverified.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export default userSlice.reducer;
