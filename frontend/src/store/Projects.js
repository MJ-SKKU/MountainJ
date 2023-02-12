import { createSlice } from "@reduxjs/toolkit";

const initialProjectsState = {
  projects: [],
  needUpdate: true,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState: initialProjectsState,
  reducers: {
    loadProjects(state, action) {
      state.projects = action.payload;
    },
    unloadProjects(state) {
      state.projects = [];
    },
    needUpdate(state){
      // true,false 중요하지 않음. 값이 변했다는게 중요.
      // 리팩토링해서 가독성 높이는 방안 찾기.
      const prev = state.needUpdate;
      state.needUpdate = !prev;
    },
  },
});

export const projectsActions = projectsSlice.actions;

export default projectsSlice.reducer;
