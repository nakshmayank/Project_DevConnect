import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: null,
  reducers: {
    addRequests: (state, action) => {
      return action.payload;
    },
    removeRequests: (state, action) => {
      const newArray = state.filter((r) => r._id != action.payload);
      return newArray;
    },
    updateRequestStatus: (state, action) => {
      const { id, status } = action.payload;

      const request = state.find((req) => req._id === id);
      if (request) {
        request.status = status;
      }
    },
  },
});

export const { addRequests, removeRequests,updateRequestStatus } = requestSlice.actions;
export default requestSlice.reducer;
