import { createSlice } from "@reduxjs/toolkit";

const initialPaysState = {
  pays: [],
};

const paysSlice = createSlice({
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

export const paysActions = paysSlice.actions;

export default paysSlice.reducer;
