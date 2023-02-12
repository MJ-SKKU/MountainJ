import { createSlice } from "@reduxjs/toolkit";

const initialPaysState = {
  pays: [],
  needUpdate: true,
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
    needUpdate(state){
      // true,false 중요하지 않음. 값이 변했다는게 중요.
      // 리팩토링해서 가독성 높이는 방안 찾기.
      const prev = state.needUpdate;
      state.needUpdate = !prev;
    },
  },
});

export const paysActions = paysSlice.actions;

export default paysSlice.reducer;
