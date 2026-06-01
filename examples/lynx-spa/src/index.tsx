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

import { App } from "./App.jsx";
import { getSafeSeedClassName } from "./utils/theme";

// Initialize lynx-console monitors before rendering.
// This must run before the LynxConsole component is rendered.
initLogMonitor();
initMainThreadConsole();
initNetworkMonitor();
initPerformanceMonitor();

function Root() {
  return (
    <page className={`${getSafeSeedClassName("system")} bg-bg-layer-default`}>
      <App />
    </page>
  );
}

root.render(<Root />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
