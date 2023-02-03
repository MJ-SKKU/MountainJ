import { createSlice } from "@reduxjs/toolkit";

const initialPayState = {
  money: 0,
  pay_id: null,
  payer: null,
  project: null,
  title: "",
};

const paySlice = createSlice({
  name: "pay",
  initialState: initialPayState,
  reducers: {
    setPay(state, action) {
      state.money = action.payload.money;
      state.pay_id = action.payload.pay_id;
      state.payer = action.payload.payer;
      state.project = action.payload.project;
      state.title = action.payload.title;
    },
    unsetPay(state) {
      state.money = 0;
      state.pay_id = null;
      state.payer = null;
      state.project = null;
      state.title = "";
    },
  },
});

export const payActions = paySlice.actions;

export default paySlice.reducer;
