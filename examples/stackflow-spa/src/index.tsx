import "./reset.css";
import "@seed-design/stylesheet/global.css";
import "@seed-design/css/base.min.css";
import "./global.css";

import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
