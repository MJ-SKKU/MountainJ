import { createSlice } from "@reduxjs/toolkit";

const initialProjectsState = {
  projects: [],
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
  },
});

export const projectsActions = projectsSlice.actions;

export default projectsSlice.reducer;
