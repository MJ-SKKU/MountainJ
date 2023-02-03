import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import userReducer from "./User";
import projectsReducer from "./Projects";
import projectReducer from "./ProjectInfo";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "projects", "project"],
};

const rootReducer = combineReducers({
  userReducer,
  projectsReducer,
  projectReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export const persistor = persistStore(store);

export default store;
