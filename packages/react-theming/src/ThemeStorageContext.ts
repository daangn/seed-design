import * as React from 'react';

export interface ThemeStorage {
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
}

export const StorageKey = {
  COLOR: '@seed-design/scale-color',
  PLATFORM: '@seed-design/platform',
} as const;

export const ThemeStorageContext = React.createContext<ThemeStorage | null>(null);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  ThemeStorageContext.displayName = 'ThemeStorageContext';
}
