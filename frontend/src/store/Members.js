import { createSlice } from "@reduxjs/toolkit";

const initialMembersState = {
  memObjects: [],
};

const membersSlice = createSlice({
  name: "members",
  initialState: initialMembersState,
  reducers: {
    loadMembers(state, action) {
      state.memObjects = action.payload;
    },
    unloadMembers(state) {
      state.memObjects = [];
    },
  },
});

export const membersActions = membersSlice.actions;

export default membersSlice.reducer;
