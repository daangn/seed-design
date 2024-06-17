import * as React from 'react';

import {
  StorageKey,
  type ColorMode,
} from './common';

type UseDarkModeProps = {
  mode?: ColorMode,
};

export function useThemeBehavior({
  mode = "auto",
}: UseDarkModeProps) {
  type ThemeContext = {
    setColorTheme: (theme: ColorTheme) => void,
  };

  type ColorTheme = (
    | 'system'
    | 'light'
    | 'dark'
  );

  const [colorTheme, setColorTheme] = React.useState<ColorTheme | undefined>(undefined);
  const themeContext = React.useMemo<ThemeContext>(() => ({ setColorTheme }), []);

  React.useEffect(() => {
    if (mode !== 'auto') {
      document.documentElement.dataset.seed = mode;
    }
  }, []);
  React.useEffect(() => {
    if (!document.documentElement.dataset.seedPlatform) {
      document.documentElement.dataset.seedPlatform = 'ios';
    }
  }, []);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const color = localStorage.getItem(StorageKey.COLOR);
      setColorTheme(color ? (color as ColorTheme) : 'system');
    }
  }, []);
  
  React.useEffect(() => {
    if (!colorTheme) return;

    if (mode === 'auto') {
      document.documentElement.dataset.seedScaleColor = colorTheme;
      if (colorTheme === 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.dataset.seedScaleColor = 'dark';
        }
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.documentElement.dataset.seedScaleColor = 'light';
        }
        localStorage.removeItem(StorageKey.COLOR);
      } else {
        localStorage.setItem(StorageKey.COLOR, colorTheme);
      }
    }

    if (mode === 'dark-only') {
      document.documentElement.dataset.seedScaleColor = 'dark';
      localStorage.setItem(StorageKey.COLOR, 'dark');
    }

    if (mode === 'light-only') {
      document.documentElement.dataset.seedScaleColor = 'light';
      localStorage.setItem(StorageKey.COLOR, 'light');
    }
  }, [colorTheme]);

  return themeContext;
};
