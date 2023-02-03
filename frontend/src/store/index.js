import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import userReducer from "./User";
import projectsReducer from "./Projects";
import projectReducer from "./ProjectInfo";
import paysAction from "./Pays";
import payAction from "./PayInfo";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "projects", "project", "pays", "pay"],
};

const rootReducer = combineReducers({
  userReducer,
  projectsReducer,
  projectReducer,
  paysAction,
  payAction,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export const persistor = persistStore(store);

export default store;
