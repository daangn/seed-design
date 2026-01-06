import "./reset.css";
import "./global.css";
import "@seed-design/stylesheet/global.css";
import "@seed-design/css/base.css";
import "@stackflow/plugin-basic-ui/index.css";

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
