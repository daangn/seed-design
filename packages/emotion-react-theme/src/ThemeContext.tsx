import * as React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

import type { DaangnColorScheme } from './colors';
import { makeDaangnColorScheme } from './colors';

declare module '@emotion/react' {
  export interface Theme {
    colors: DaangnColorScheme;
  }
}

const DaangnThemeProvider: React.FC<{ scheme?: 'default' | 'light' }> = ({
  scheme = 'default',
  children,
}) => {
  const theme = React.useMemo(() => {
    const colors = makeDaangnColorScheme(scheme);
    return { colors };
  }, [scheme]);

  return (
    <EmotionThemeProvider theme={theme}>
      {children}
    </EmotionThemeProvider>
  );
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  DaangnThemeProvider.displayName = 'DaangnThemeProvider';
}

export default DaangnThemeProvider;
