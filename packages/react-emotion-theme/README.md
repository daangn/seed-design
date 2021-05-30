# @karrotmarket/react-emotion-theme

## Usage

### Installation

```bash
yarn add @emotion/react @karrotmarket/react-emotion-theme
```

### Setup Provider

```tsx
import { KarrotThemeProvider } from '@karrotmarket/react-emotion-theme';

// ...
<KarrotThemeProvider>
  <MyThemedComponent />
</KarrotThemeProvider>
```

### Usage with `@emotion/styled`

```tsx
const Box = styled.div(props => ({
  color: props.theme.colors.$carrot50,
  backgroundColor: props.theme.colors.$carrot500,
}));
```

### Dark mode context

```tsx
import { useDarkMode } from '@karrotmarket/react-emotion-theme';

function MyComponent() {
  const {
    value: isDarkMode,
    toggle: toggleDarkMode,
    enable: enableDarkMode,
    disable: disableDarkMode,
  } = useDarkMode();
}
```

### Usage with custom theme

`KarrotThemeProvider` is just a [`ThemeProvider`](https://emotion.sh/docs/theming) with predefined types and dark-mode behavior.

You can use `ThemeProvider` directly to opt-out the default behavior.

```tsx
import { useDarkMode } from 'use-dark-mode';
import type { ColorScheme } from '@karrotmarket/design-token';
import { colors } from '@karrotmarket/design-token';
import { DarkModeContext } from '@karrotmarket/react-emotion-theme';
import { ThemeProvider } from '@emotion/react';

type CustomTheme = {
  colors: ColorScheme,
  myColors: MyColorScheme,
};

const theme: CustomTheme = {
  colors: colors.light.scheme,
  myColors: {/* ... */},
};

declare module '@emotion/react' {
  interface Theme extends CustomTheme {}
}

// ...

// You should provide dark mode context and control its behavior since you did opt-out the default
const darkMode = useDarkMode();

<DarkModeContext.Provider value={darkMode}>
  <ThemeProvider theme={theme}>
    <MyThemedComponent />
  </ThemeProvider>
</DarkModeContext.Provider>
```
