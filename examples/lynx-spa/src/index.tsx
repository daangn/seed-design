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

import { getThemeClassName } from "@seed-design/rsbuild-plugin/lynx";
import { App } from "./App.jsx";

// Initialize lynx-console monitors before rendering.
// This must run before the LynxConsole component is rendered.
initLogMonitor();
initMainThreadConsole();
initNetworkMonitor();
initPerformanceMonitor();

root.render(<App />);
declare const __SEED_COLOR_MODE__: string;

const colorMode = typeof __SEED_COLOR_MODE__ !== "undefined" ? __SEED_COLOR_MODE__ : "system";
const systemTheme = (lynx?.__globalProps as Record<string, unknown>)?.theme as string | undefined;
const themeClass = getThemeClassName(
  colorMode as "system" | "light-only" | "dark-only",
  systemTheme,
);

root.render(
  <page
    className={themeClass}
    style={{ backgroundColor: 'var(--seed-color-bg-layer-default)' }}
  >
    <App />
  </page>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
