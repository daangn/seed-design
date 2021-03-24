import type { ColorScheme, ColorToken } from '@daangn/design-token';

export type DaangnColorScheme = ConvertedColorScheme;

type RemoveTokenPrefix<Token> = Token extends `$${infer Rest}` ? Rest : Token;

function removeTokenPrefix(token: ColorToken): RemoveTokenPrefix<ColorToken> {
  return token.substr(1) as RemoveTokenPrefix<ColorToken>;
}

type ConvertedColorScheme = Record<RemoveTokenPrefix<ColorToken>, string>;

export function convertColorScheme(colors: ColorScheme): ConvertedColorScheme {
  const result = {} as ConvertedColorScheme;
  for (const [key, value] of Object.entries(colors)) {
    result[removeTokenPrefix(key as ColorToken)] = value;
  }
  return result;
}
