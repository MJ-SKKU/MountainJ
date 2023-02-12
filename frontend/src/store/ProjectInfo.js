import { createSlice } from "@reduxjs/toolkit";

const initialProjectState = {
  project_id: null,
  status: null,
  owner: null,
  title: "",
  event_dt: "",
  end_dt: "",
  needUpdate: true,
};

const projectSlice = createSlice({
  name: "project",
  initialState: initialProjectState,
  reducers: {
    setProject(state, action) {
      state.project_id = action.payload.project_id;
      state.status = action.payload.status;
      state.owner = action.payload.owner;
      state.title = action.payload.title;
      state.event_dt = action.payload.event_dt;
      state.end_dt = action.payload.end_dt;
    },
    unsetProject(state) {
      state.project_id = null;
      state.status = null;
      state.owner = null;
      state.title = "";
      state.event_dt = "";
      state.end_dt = "";
    },
    needUpdate(state){
      // true,false 중요하지 않음. 값이 변했다는게 중요.
      // 리팩토링해서 가독성 높이는 방안 찾기.
      const prev = state.needUpdate;
      state.needUpdate = !prev;
    },
  },
});

export const projectActions = projectSlice.actions;

export default projectSlice.reducer;
