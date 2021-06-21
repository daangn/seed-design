import * as React from 'react';
import { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from 'styled-components';
import type { ColorScheme, SemanticColorScheme } from '@karrotmarket/design-token';
import { colors, populateSemanticColors } from '@karrotmarket/design-token';
import type { BehaviorMode } from '@karrotmarket/react-theming';
import {
  DarkModeContext,
  getThemeName,
  useDarkModeBehavior,
  useColorScheme,
} from '@karrotmarket/react-theming';

export type KarrotTheme = {
  colors: ColorScheme & SemanticColorScheme,
};

declare module 'styled-components' {
  export interface DefaultTheme extends KarrotTheme {}
}

type KarrotThemeProviderProps = {
  children: React.ReactNode,
  mode?: BehaviorMode,
};

// required for iOS
const GlobalStyle = createGlobalStyle<{ colorScheme: string }>(props => ({
  ':root': {
    colorScheme: props.colorScheme,
  },
}));

export const KarrotThemeProvider: React.FC<KarrotThemeProviderProps> = ({
  children,
  mode = 'auto',
}) => {
  const darkMode = useDarkModeBehavior({ mode });
  const colorScheme = useColorScheme({ mode });

  const theme = React.useMemo(() => {
    const isDarkMode = darkMode.value;
    const colorTheme = colors[getThemeName(mode, isDarkMode)];
    return {
      colors: {
        ...colorTheme.scheme,
        ...populateSemanticColors(
          colorTheme.scheme,
          colorTheme.semanticScheme,
        ),
      },
    };
  }, [mode, darkMode.value]);

  return (
    <>
      {/* required for iOS */}
      <GlobalStyle colorScheme={colorScheme} />

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
