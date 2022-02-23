import type { KebabCase } from 'type-fest';
import type {
  ColorTheme,
  ColorToken,
  SemanticColorKey,
} from '@karrotmarket/design-token';

function kebabcase<T extends string>(str: T): KebabCase<T> {
  return str.replace(/[A-Z]/g, v => `-${v.toLowerCase()}`) as KebabCase<T>;
}

type RemoveTokenPrefix<Token> = Token extends `$${infer Rest}` ? Rest : Token;
function removeTokenPrefix(token: ColorToken): RemoveTokenPrefix<ColorToken> {
  return token.substr(1) as RemoveTokenPrefix<ColorToken>;
}

type ConvertedColorKey = RemoveTokenPrefix<ColorToken>;
type ConvertedSemanticColorKey = KebabCase<SemanticColorKey>;
type ConvertedColorTheme = Record<ConvertedColorKey | ConvertedSemanticColorKey, string>;

export function convertColorTheme(baseTheme: ColorTheme): Readonly<ConvertedColorTheme> {
  const result = {} as ConvertedColorTheme;
  for (const [key, value] of Object.entries(baseTheme.scheme)) {
    result[removeTokenPrefix(key as ColorToken)] = value;
  }
  for (const [key, value] of Object.entries(baseTheme.semanticScheme)) {
    result[kebabcase(key as SemanticColorKey)] = value;
  }
  return Object.freeze(result);
}
