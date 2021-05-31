import * as React from 'react';

export const ThemeStorageContext = React.createContext<WindowLocalStorage | undefined>(undefined);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  ThemeStorageContext.displayName = 'ThemeStorageContext';
}
