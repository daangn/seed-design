# @karrotmarket/react-stitches

Karrot's preset config and utils for [Stitches.js](https://stitches.dev/)

## Installation

```bash
yarn add @stitches/react @karrotmarket/react-stitches
```

## Usage

```tsx
import { styled } from '@karrotmarket/react-stitches/config';

const Box = styled('div', {
  color: '$carrot500',
  backgroundColor: '$background',
});
```

## Create custom config

```tsx
import { createCss } from '@stitches/react';
import { colors } from '@karrotmarket/design-token';
import { convertColorTheme } from '@karrotmarket/react-stitches/colors';

export const { styled, theme } = createCss({
  theme: {
    colors: convertColorTheme(colors.light),
  },
  // Custom media, utils, etc
});

export darkTheme = theme('dark-theme', {
  colors: convertColorTheme(colors.dark),
});
```
