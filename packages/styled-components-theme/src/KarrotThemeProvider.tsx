import * as React from 'react';
import useDarkMode from 'use-dark-mode';
import { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from 'styled-components';
import type { ColorScheme, SemanticColorScheme } from '@karrotmarket/design-token';
import { colors, populateSemanticColors } from '@karrotmarket/design-token';
import { ThemeStorageContext, DarkModeContext } from '@karrotmarket/react-theming';

export type KarrotTheme = {
  colors: ColorScheme & SemanticColorScheme,
};

declare module 'styled-components' {
  export interface DefaultTheme extends KarrotTheme {}
}

type KarrotThemeProviderProps = {
  children: React.ReactNode,
};

// required for iOS
const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light dark;
  }
`;

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
      <GlobalStyle />
      <DarkModeContext.Provider value={darkMode}>
        <StyledComponentsThemeProvider theme={theme}>
          {children}
        </StyledComponentsThemeProvider>
      </DarkModeContext.Provider>
    </>
  );
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  KarrotThemeProvider.displayName = 'KarrotThemeProvider(StyledComponents)';
}
