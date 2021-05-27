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

### Usage with custom theme

`KarrotThemeProvider` is just a [`ThemeProvider`](https://emotion.sh/docs/theming) with predefined types and dark-mode behavior.

You can use `ThemeProvider` directly to opt-out the default behavior.

```tsx
import type { ColorScheme } from '@karrotmarket/design-token';
import { colors } from '@karrotmarket/design-token';
import { ThemeProvider } from '@emotion/react';

type CustomTheme = {
  colors: ColorScheme,
  myColors: MyColorScheme,
};

const theme: CustomTheme = {
  colors: colors.light,
  myColors: {/* ... */},
};

declare module '@emotion/react' {
  interface Theme extends CustomTheme {}
}

// ...
<ThemeProvider theme={theme}>
  <MyThemedComponent />
</ThemeProvider>
```
