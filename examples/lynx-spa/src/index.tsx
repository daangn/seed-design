import "@lynx-js/preact-devtools";
import { root } from "@lynx-js/react";
import "@lynx-js/react/debug";
import {
  initLogMonitor,
  initMainThreadConsole,
  initNetworkMonitor,
  initPerformanceMonitor,
} from "lynx-console/setup";

import "./styles/global.css";

import { getSeedClassName } from "@seed-design/lynx-react";
import { App } from "./App.jsx";

// Initialize lynx-console monitors before rendering.
// This must run before the LynxConsole component is rendered.
initLogMonitor();
initMainThreadConsole();
initNetworkMonitor();
initPerformanceMonitor();

root.render(
  <page
    className={getSeedClassName({ colorMode: "system" })}
    style={{ backgroundColor: 'var(--seed-color-bg-layer-default)' }}
  >
    <App />
  </page>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
