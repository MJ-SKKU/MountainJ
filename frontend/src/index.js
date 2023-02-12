import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import ReactGA from "react-ga4";
import { API } from "./config"

import store from "./store/index";
import { persistor } from "./store/index";
import Router from "./Router";
import "./index.css";
import "./assets/fonts/font.css";

ReactGA.initialize(API.GA4_KEY)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router />
    </PersistGate>
  </Provider>
);
