import * as React from 'react';

export const KarrotThemeStorageContext = React.createContext<WindowLocalStorage | undefined>(undefined);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  KarrotThemeStorageContext.displayName = 'KarrotThemeStorageContext';
}
