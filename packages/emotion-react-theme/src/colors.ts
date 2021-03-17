import type { ColorScheme, ColorToken } from '@daangn/design-token';
import { colors as daangnColors } from '@daangn/design-token';

export type DaangnColorScheme = ConvertedColorScheme;

type RemoveTokenPrefix<Token> = Token extends `$${infer Rest}` ? Rest : Token;

function removeTokenPrefix(token: ColorToken): RemoveTokenPrefix<ColorToken> {
  return token.substr(1) as RemoveTokenPrefix<ColorToken>;
}

type ConvertedColorScheme = Record<RemoveTokenPrefix<ColorToken>, string>;

function convertColorScheme(colors: ColorScheme): ConvertedColorScheme {
  const result = {} as ConvertedColorScheme;
  for (const [key, value] of Object.entries(colors)) {
    result[removeTokenPrefix(key as ColorToken)] = value;
  }
  return result;
}

/**
 * - default: 기본 값 (=light, 추후 prefer-color-scheme 으로 변경될 예정)
 * - light: 밝은 테마
 */
export function makeDaangnColorScheme(name: 'default' | 'light' = 'default'): DaangnColorScheme {
  switch (name) {
    case 'default':
    case 'light':
      return convertColorScheme(daangnColors.light);
  }
}
