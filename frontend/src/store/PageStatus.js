import { createSlice, configureStore, createStore } from "@reduxjs/toolkit";

const pageStatusState = {
    latestURL: "",
    using:false,
    isModalOpen:false,
    tutOpen:true,
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
    },
    isModalOpen(state,action){
      state.isModalOpen = action.payload;
    },
    tutOpen(state,action){
      state.tutOpen = action.payload;
    }
  },
});

export const pageStatusActions = pageStatusSlice.actions;

// export const pageStatusState = pageStatusState;

export default pageStatusSlice.reducer;
// export const pageStatusStore = createStore(pageStatusSlice.reducer);

