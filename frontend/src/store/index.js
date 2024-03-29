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
import paysReducer from "./Pays";
import payReducer from "./PayInfo";
import resultsReducer from "./Results";
import membersReducer from "./Members";
import pageStatusReducer from "./PageStatus";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  userReducer,
  projectsReducer,
  projectReducer,
  paysReducer,
  payReducer,
  resultsReducer,
  membersReducer,
  pageStatusReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export const persistor = persistStore(store);

export default store;
