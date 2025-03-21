import * as vars from "./vars";
export { vars };

export type TokenObject = typeof vars;

export type ColorFg = keyof TokenObject["$color"]["fg"];

export type ColorBg = keyof TokenObject["$color"]["bg"];

export type ColorStroke = keyof TokenObject["$color"]["stroke"];

export type ColorPalette = keyof TokenObject["$color"]["palette"];

export type Duration = keyof TokenObject["$duration"];

export type FontSize = keyof TokenObject["$fontSize"];

export type FontWeight = keyof TokenObject["$fontWeight"];

export type Gradient = keyof TokenObject["$gradient"];

export type LineHeight = keyof TokenObject["$lineHeight"];

export type Radius = keyof TokenObject["$radius"];

export type TimingFunction = keyof TokenObject["$timingFunction"];

export type Dimension = Exclude<keyof TokenObject["$dimension"], "spacingX" | "spacingY">;

export type SpacingX = keyof TokenObject["$dimension"]["spacingX"];

export type SpacingY = keyof TokenObject["$dimension"]["spacingY"];
