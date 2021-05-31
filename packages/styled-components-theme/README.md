# @karrotmarket/styled-components-theme

## Installation

```bash
yarn add styled-components @karrotmarket/styled-components-theme
```

## Usage

### Setup Provider

```tsx
import { KarrotThemeProvider } from '@karrotmarket/styled-components-theme';

// ...
<KarrotThemeProvider>
  <MyThemedComponent />
</KarrotThemeProvider>
```

### Using `styled`

```tsx
const Box = styled.div(props => ({
  color: props.theme.colors.$carrot50,
  backgroundColor: props.theme.colors.$carrot500,
}));
```

### Dark mode context

```tsx
import { useDarkMode } from '@karrotmarket/styled-components-theme';

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

`KarrotThemeProvider` is just a [`ThemeProvider`](https://styled-components.com/docs/api#themeprovider) with predefined types and dark-mode behavior.

You can use `ThemeProvider` directly to opt-out the default behavior.

```tsx
import { useDarkMode } from 'use-dark-mode';
import type { ColorScheme } from '@karrotmarket/design-token';
import { colors } from '@karrotmarket/design-token';
import { DarkModeContext } from '@karrotmarket/styled-components-theme';
import { ThemeProvider } from 'styled-components';

type CustomTheme = {
  colors: ColorScheme,
  myColors: MyColorScheme,
};

const theme: CustomTheme = {
  colors: colors.light.scheme,
  myColors: {/* ... */},
};

declare module 'styled-components' {
  interface DefaultTheme extends CustomTheme {}
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
