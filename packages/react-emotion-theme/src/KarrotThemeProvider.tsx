import * as React from 'react';
import useDarkMode from 'use-dark-mode';
import { css, Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import type { ColorScheme, SemanticColorScheme } from '@karrotmarket/design-token';
import { colors, populateSemanticColors } from '@karrotmarket/design-token';
import { ThemeStorageContext, DarkModeContext } from '@karrotmarket/react-theming';

export type KarrotTheme = {
  colors: ColorScheme & SemanticColorScheme,
};

declare module '@emotion/react' {
  export interface Theme extends KarrotTheme {}
}

type KarrotThemeProviderProps = {
  children: React.ReactNode,
};

export const KarrotThemeProvider: React.FC<KarrotThemeProviderProps> = ({
  children,
}) => {
  const storage = React.useContext(ThemeStorageContext);
  const darkMode = useDarkMode(false, {
    storageProvider: storage,
    classNameDark: 'dark-theme',
    classNameLight: 'light-theme',
  });

  const theme = React.useMemo(() => {
    const isDarkMode = darkMode.value;
    const colorTheme = isDarkMode ? colors.dark : colors.light;
    return {
      colors: {
        ...colorTheme.scheme,
        ...populateSemanticColors(
          colorTheme.scheme,
          colorTheme.semanticScheme,
        ),
      },
    };
  }, [darkMode.value]);

  return (
    <>
      {/* required for iOS */}
      <Global
        styles={css`
          :root {
            color-scheme: light dark;
          }
        `}
      />
      <DarkModeContext.Provider value={darkMode}>
        <EmotionThemeProvider theme={theme}>
          {children}
        </EmotionThemeProvider>
      </DarkModeContext.Provider>
    </>
  );
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  KarrotThemeProvider.displayName = 'KarrotThemeProvider';
}
