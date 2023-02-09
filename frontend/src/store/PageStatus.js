import { createSlice, configureStore, createStore } from "@reduxjs/toolkit";

const pageStatusState = {
    latestURL: "",
    using:false,
};

const pageStatusSlice = createSlice({
  name: "pageStatus",
  initialState: pageStatusState,
  reducers: {
    setUsing(state, action) {
      state.using = action.payload;
    },
    setLatestURL(state, action) {
      state.latestURL = action.payload;
    }
  },
});

export const pageStatusActions = pageStatusSlice.actions;

// export const pageStatusState = pageStatusState;

export default pageStatusSlice.reducer;
// export const pageStatusStore = createStore(pageStatusSlice.reducer);

