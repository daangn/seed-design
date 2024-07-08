import "./reset.css";
import "@seed-design/stylesheet/base.css";
import "@seed-design/stylesheet/token.css";
import "@stackflow/plugin-basic-ui/index.css";
import "./global.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
