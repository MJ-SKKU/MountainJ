import { createSlice } from "@reduxjs/toolkit";

const initialProjectState = {
  project_id: null,
  status: null,
  owner: null,
  title: "",
  event_dt: "",
  end_dt: "",
};

const projectSlice = createSlice({
  name: "project",
  initialState: initialProjectState,
  reducers: {
    loadProject(state, action) {
      state.project_id = action.payload.project_id;
      state.status = action.payload.status;
      state.owner = action.payload.owner;
      state.title = action.payload.title;
      state.event_dt = action.payload.event_dt;
      state.end_dt = action.payload.end_dt;
    },
    unloadProject(state) {
      state.project_id = null;
      state.status = null;
      state.owner = null;
      state.title = "";
      state.event_dt = "";
      state.end_dt = "";
    },
  },
});

export const projectActions = projectSlice.actions;

export default projectSlice.reducer;
