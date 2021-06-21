import * as React from 'react';
import { Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';
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

declare module '@emotion/react' {
  export interface Theme extends KarrotTheme {}
}

type KarrotThemeProviderProps = {
  children: React.ReactNode,

  /**
   * Behavior mode
   *
   * @default 'auto'
   */
  mode?: BehaviorMode,
};

export const KarrotThemeProvider: React.FC<KarrotThemeProviderProps> = ({
  children,
  mode = 'auto',
}) => {
  const darkMode = useDarkModeBehavior({ mode });
  const colorScheme = useColorScheme({ mode });

  const theme = React.useMemo(() => {
    const isDarkMode = darkMode.value;

    // 아 패턴매칭 마렵네 진짜
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
      <Global
        styles={{
          ':root': {
            colorScheme,
          },
        }}
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
  KarrotThemeProvider.displayName = 'KarrotThemeProvider(Emotion)';
}
