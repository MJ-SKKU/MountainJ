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
    setPayMembers(state, action) {
      state.paymembers = action.payload.paymembers;
    },
    unsetPay(state) {
      state.money = 0;
      state.pay_id = null;
      state.payer = null;
      state.project = null;
      state.title = "";
    },
    unsetPayMembers(state){
      state.paymembers = [];
    }
  },
});

export const payActions = paySlice.actions;

export default paySlice.reducer;
