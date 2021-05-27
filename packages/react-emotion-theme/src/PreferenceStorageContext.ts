import * as React from 'react';

export const PreferenceStorageContext = React.createContext<WindowLocalStorage | undefined>(undefined);

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  PreferenceStorageContext.displayName = 'PreferenceStorageContext';
}
