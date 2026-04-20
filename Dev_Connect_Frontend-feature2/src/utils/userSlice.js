import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,

  reducers: {

    addUser: (state, action) => {
      return action.payload;
    },

    removeUser: () => {
      return null;
    },

    increaseFollowers: (state) => {
      if (state) {
        state.followersCount = (state.followersCount || 0) + 1;
      }
    },

    decreaseFollowers: (state) => {
      if (state && state.followersCount > 0) {
        state.followersCount -= 1;
      }
    },

    increaseFollowing: (state) => {
      if (state) {
        state.followingCount = (state.followingCount || 0) + 1;
      }
    },

    decreaseFollowing: (state) => {
      if (state && state.followingCount > 0) {
        state.followingCount -= 1;
      }
    },

  },
});

export const {
  addUser,
  removeUser,
  increaseFollowers,
  decreaseFollowers,
  increaseFollowing,
  decreaseFollowing
} = userSlice.actions;

export default userSlice.reducer;