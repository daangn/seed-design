import * as React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import type { ColorScheme } from '@karrotmarket/design-token';
import { colors } from '@karrotmarket/design-token';

export type KarrotTheme = {
  colors: ColorScheme,
};

declare module '@emotion/react' {
  export interface Theme extends KarrotTheme {}
}

type KarrotThemeProviderProps = {
  theme: KarrotTheme,
};

export const KarrotThemeProvider: React.FC<KarrotThemeProviderProps> = ({
  children,
}) => {
  const theme = React.useMemo(() => ({
    colors: colors.light,
  }), []);

  return (
    <EmotionThemeProvider theme={theme}>
      {children}
    </EmotionThemeProvider>
  );
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  KarrotThemeProvider.displayName = 'KarrotThemeProvider';
}
