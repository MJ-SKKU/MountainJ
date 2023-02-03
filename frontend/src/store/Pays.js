import { createSlice } from "@reduxjs/toolkit";

const initialPaysState = {
  pays: [],
};

const userSlice = createSlice({
  name: "pays",
  initialState: initialPaysState,
  reducers: {
    loadPays(state, action) {
      state.pays = action.payload;
    },
    unloadPays(state) {
      state.pays = [];
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
