import * as React from 'react';

import { StorageKey, ThemeStorageContext } from './ThemeStorageContext';
import {
  type ColorMode,
} from './common';

type UseDarkModeProps = {
  mode: ColorMode,
};

export function useThemeBehavior({
  mode,
}: UseDarkModeProps) {
  type ThemeContext = {
    setColorVariant: (variant: ColorVariant) => void,
  };

  type ColorVariant = (
    | 'system'
    | 'light'
    | 'dark'
  );

  const storage = React.useContext(ThemeStorageContext);
  const [colorVariant, setColorVariant] = React.useState<ColorVariant>('system');
  const themeContext = React.useMemo<ThemeContext>(() => ({ setColorVariant }), [colorVariant]);
  
  React.useEffect(() => {
    if (mode === 'auto') {
      document.documentElement.dataset.seedScaleColor = colorVariant;
      if (storage) {
        if (colorVariant === 'system') {
          void storage.removeItem(StorageKey.COLOR);
        } else {
          void storage.setItem(StorageKey.COLOR, colorVariant);
        }
      }
    } else { // mode === 'light-only' || mode === 'dark-only'
      const variant = mode === 'light-only' ? 'light' : 'dark';
      document.documentElement.dataset.seedScaleColor = variant;
      if (storage) {
        void storage.setItem(StorageKey.COLOR, variant);
      }
    }
  }, [colorVariant, mode]);

  React.useEffect(() => {
    if (!document.documentElement.dataset.seedPlatform) {
      document.documentElement.dataset.seedPlatform = 'unknown';
    }
  }, []);

  return themeContext;
};
