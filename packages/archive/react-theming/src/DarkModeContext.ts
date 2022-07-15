import * as React from 'react';
import type { DarkMode } from 'use-dark-mode';

const noop = () => {};

const dummy: DarkMode = {
  value: false,
  enable: noop,
  disable: noop,
  toggle: noop,
};

export const DarkModeContext = React.createContext<DarkMode>(dummy);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  DarkModeContext.displayName = 'DarkModeContext';
}

export function useDarkMode(): DarkMode {
  return React.useContext(DarkModeContext);
}
