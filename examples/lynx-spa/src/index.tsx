import "@lynx-js/preact-devtools";
import { root } from "@lynx-js/react";
import "@lynx-js/react/debug";

import "./styles/global.css";

import { App } from "./App.jsx";

root.render(<App />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
