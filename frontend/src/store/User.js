import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  user: {},
  token: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = {};
      state.isAuthenticated = false;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
