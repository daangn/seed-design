/**
 * Elements of design tokens
 *
 * follows the System-UI's [Theme specification](https://system-ui.com/theme/)
 */

// colors[name] - color, background-color, border-color
export * as colors from './colors';
export type {
  ColorTheme,
  ColorToken,
  ColorScheme,
  KnownColorGroup,
  SemanticColorKey,
  SemanticColorScheme,
} from './colors/types';
export { parseColorToken } from './colors/token';
export { populateSemanticColors } from './colors/utils';

// fonts[name] - font-family
export * as fonts from './fonts';
export type {
  FontTheme,
  FontToken,
  FontScheme,
  SemanticFontKey,
  SemanticFontScheme,
} from './fonts/types';
