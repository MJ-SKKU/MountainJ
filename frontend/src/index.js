import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import Router from "./Router";
import store from "./store";
import "./index.css";
import "./assets/fonts/font.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Router />
  </Provider>
);
