import { em } from 'polished';
import { createCss } from '@stitches/react';
import { colors } from '@karrotmarket/design-token';

import { convertColorTheme } from './colors';

export const { styled, css, global, keyframes, getCssString, theme } = createCss({

  // Mobile-first
  //
  // follows Bootstrap's breakpoints practice
  // See https://getbootstrap.com/docs/5.0/layout/breakpoints/#available-breakpoints
  media: {
    sm: `(min-width: ${em(576)})`,
    md: `(min-width: ${em(768)})`,
    lg: `(min-width: ${em(992)})`,
    xl: `(min-width: ${em(1200)})`,
    xxl: `(min-width: ${em(1400)})`,
  },

  theme: {
    colors: convertColorTheme(colors.light),

    fonts: {
      system: '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", BlinkMacSystemFont, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
  },

  utils: {
    marginX: _config => value => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: _config => value => ({
      marginTop: value,
      marginBottom: value,
    }),
    paddingX: _config => value => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    paddingY: _config => value => ({
      paddingTop: value,
      paddingBottom: value,
    }),
  },
});

export const darkTheme = theme('dark-theme', {
  colors: convertColorTheme(colors.dark),
});

export const useGlobalStyle = global({
  ':root': {
    colorScheme: 'light dark',
  },
});
