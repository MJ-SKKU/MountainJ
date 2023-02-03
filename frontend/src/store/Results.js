import { createSlice } from "@reduxjs/toolkit";

const initialResultsState = {
  results: [],
};

const resultsSlice = createSlice({
  name: "results",
  initialState: initialResultsState,
  reducers: {
    loadResults(state, action) {
      state.results = action.payload;
    },
    unloadResults(state) {
      state.results = [];
    },
  },
});

export const resultsActions = resultsSlice.actions;

export default resultsSlice.reducer;
