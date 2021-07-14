export type FontToken = (
  | '$system'
);

export type FontScheme = Record<FontToken, string>;

export type SemanticFontScheme = {
  system: string,
};

export type SemanticFontKey = keyof SemanticFontScheme;

export type FontTheme = {
  scheme: FontScheme,
  semanticScheme: SemanticFontScheme,
};
