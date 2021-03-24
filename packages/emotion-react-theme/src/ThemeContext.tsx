import * as React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import type { ColorScheme } from '@daangn/design-token';
import type { DaangnColorScheme } from './colors';
import { convertColorScheme } from './colors';

interface ThemeProps {
  colors: ColorScheme;
}

interface DaangnTheme {
  colors: DaangnColorScheme;
}

declare module '@emotion/react' {
  export interface Theme extends Readonly<DaangnTheme> {}
}

export const DaangnThemeProvider: React.FC<ThemeProps> = ({
  children,
  ...themeProps
}) => {
  const theme = React.useMemo(() => {
    const daangnTheme: Readonly<DaangnTheme> = Object.freeze({
      colors: convertColorScheme(themeProps.colors),
    });
    return daangnTheme;
  }, [themeProps]);

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
