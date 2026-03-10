import '@lynx-js/preact-devtools';
import { root } from '@lynx-js/react';
import '@lynx-js/react/debug';

import './styles/global.css';

import { getThemeClassName } from '@seed-design/rsbuild-plugin/lynx';
import { App } from './App.jsx';

declare const __SEED_COLOR_MODE__: string;

const colorMode =
  typeof __SEED_COLOR_MODE__ !== 'undefined' ? __SEED_COLOR_MODE__ : 'system';
const systemTheme = (lynx?.__globalProps as Record<string, unknown>)?.theme as
  | string
  | undefined;
const themeClass = getThemeClassName(
  colorMode as 'system' | 'light-only' | 'dark-only',
  systemTheme,
);

root.render(
  <page className={themeClass}>
    <App />
  </page>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
