import type { TokenObject } from '../types';

type Theme = {
  colors: ColorTheme,
};

type ColorTheme = Record<Color, string>;

type Color = (
  | SemanticColor
  | ScaleColor
  | StaticColor
);

type SemanticColor = keyof TokenObject['semantic']['color'];
type ScaleColor = `scale${Capitalize<keyof TokenObject['scale']['color']>}`;
type StaticColor = `static${Capitalize<keyof TokenObject['scale']['color']>}`;

export function toStitchesTheme(tokenObject: TokenObject): Theme {
  function capitalize(str: string) {
    return str.replace(/[ -_]./g, substr => substr[1].toUpperCase());
  }

  const colors = {};
  for (const [key, value] of Object.entries(tokenObject.static)) {
    colors[`static${capitalize(key)}`] = value;
  }
  for (const [key, value] of Object.entries(tokenObject.scale)) {
    colors[`scale${capitalize(key)}`] = value;
  }
  for (const [key, value] of Object.entries(tokenObject.semantic)) {
    colors[capitalize(key)] = value;
  }

  return {
    colors: colors as ColorTheme,
  };
}
