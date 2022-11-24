import * as React from 'react';
import { type useThemeBehavior } from './useThemeBehavior';

export type ThemeContext = ReturnType<typeof useThemeBehavior>;

const initialContext: ThemeContext = {
  setColorTheme: () => {},
};

export const ThemeContext = React.createContext<ThemeContext>(initialContext);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  ThemeContext.displayName = 'ThemeContext';
}

export function useTheme(): ThemeContext {
  return React.useContext(ThemeContext);
}
