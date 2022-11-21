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
    setColorVariant: (variant: ColorVariant) => void,
    colorVariant: ColorVariant | undefined,
  };

  type ColorVariant = (
    | 'system'
    | 'light'
    | 'dark'
  );

  const [colorVariant, setColorVariant] = React.useState<ColorVariant | undefined>(undefined);
  const themeContext = React.useMemo<ThemeContext>(() => ({ colorVariant, setColorVariant }), [colorVariant]);

  React.useEffect(() => {
    if (!document.body.dataset.seedPlatform) {
      document.body.dataset.seedPlatform = 'unknown';
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const color = window.localStorage.getItem(StorageKey.COLOR);
      setColorVariant(color ? (color as ColorVariant) : 'system');
    }
  }, []);
  
  React.useEffect(() => {
    if (!colorVariant) return;

    if (mode === 'auto') {
      document.body.dataset.seedScaleColor = colorVariant;
      if (colorVariant === 'system') {
        window.localStorage.removeItem(StorageKey.COLOR);
      } else {
        window.localStorage.setItem(StorageKey.COLOR, colorVariant);
      }
    } else { // mode === 'light-only' || mode === 'dark-only'
      const variant = mode === 'light-only' ? 'light' : 'dark';    
      document.body.dataset.seedScaleColor = variant;
      window.localStorage.setItem(StorageKey.COLOR, variant);
    }
  }, [colorVariant, mode]);

  return themeContext;
};
