import * as React from 'react';
import useDarkMode from 'use-dark-mode';
import { css, Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import type { ColorScheme, SemanticColorScheme } from '@karrotmarket/design-token';
import { colors } from '@karrotmarket/design-token';

import { PreferenceStorageContext } from './PreferenceStorageContext';

export type KarrotTheme = {
  colors: ColorScheme & SemanticColorScheme,
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
  const prefStorage = React.useContext(PreferenceStorageContext);
  const darkMode = useDarkMode(false, {
    storageProvider: prefStorage,
  });
  const theme = React.useMemo(() => ({
    colors: {
      ...darkMode.value ? {
        ...colors.dark,
        ...colors.semantics.dark,
      } : {
        ...colors.light,
        ...colors.semantics.light,
      },
    },
  }), [darkMode.value]);

  return (
    <EmotionThemeProvider theme={theme}>
      {/* required for iOS */}
      <Global
        styles={css`
          :root {
            color-scheme: light dark;
          }
        `}
      />
      {children}
    </EmotionThemeProvider>
  );
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  KarrotThemeProvider.displayName = 'KarrotThemeProvider';
}
