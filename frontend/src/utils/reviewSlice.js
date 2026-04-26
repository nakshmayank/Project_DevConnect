import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "review",
  initialState: [],
  reducers: {
    getReview: (state, action) => {
      return action.payload;
    },
    addReview: (state, action) => {
      state.push(action.payload);
    },
    deleteReview: (state, action) => {
      return state.filter((r) => r._id !== action.payload);
    },
    updateReview: (state, action) => {
      const index = state.findIndex((r) => r._id === action.payload._id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { getReview, addReview, deleteReview, updateReview } =
  reviewSlice.actions;
export default reviewSlice.reducer;
