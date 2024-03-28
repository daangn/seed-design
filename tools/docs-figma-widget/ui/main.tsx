import "./styles/reset.css";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
