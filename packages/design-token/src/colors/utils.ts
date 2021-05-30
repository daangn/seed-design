import type {
  ColorToken,
  ColorScheme,
  SemanticColorKey,
  SemanticColorScheme,
} from './types';

export function populateSemanticColors(colors: ColorScheme, semantics: SemanticColorScheme): Readonly<SemanticColorScheme> {
  const result = {} as SemanticColorScheme;
  for (const [k, v] of Object.entries(semantics)) {
    result[k as SemanticColorKey] = colors[v as ColorToken] ?? v;
  }
  return Object.freeze(result);
}
