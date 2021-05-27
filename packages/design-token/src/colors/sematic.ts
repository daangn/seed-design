import type { ColorToken, ColorScheme } from './types';

export type SemanticColorScheme = {
  white: ColorToken | string,
  background: ColorToken | string,
  backgroundLow: ColorToken | string,
};

export type SemanticColorKey = keyof SemanticColorScheme;

export function populateSemanticColors(colors: ColorScheme, semantics: SemanticColorScheme): Readonly<SemanticColorScheme> {
  const result = {} as SemanticColorScheme;
  for (const [k, v] of Object.entries(semantics)) {
    result[k as SemanticColorKey] = colors[v as ColorToken] ?? v;
  }
  return Object.freeze(result);
}
