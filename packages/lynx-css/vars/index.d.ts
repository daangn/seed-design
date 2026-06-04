import * as vars from "./vars";
export { vars };

export type TokenObject = typeof vars;

export type ColorFg = keyof TokenObject["$color"]["fg"];

// Workaround for type docgen enumerating all possible values
export type ScopedColorFg = Exclude<`fg.${ColorFg}`, "">;

export type ColorBg = keyof TokenObject["$color"]["bg"];

// Workaround for type docgen enumerating all possible values
export type ScopedColorBg = Exclude<`bg.${ColorBg}`, "">;

export type ColorBanner = keyof TokenObject["$color"]["banner"];

// Workaround for type docgen enumerating all possible values
export type ScopedColorBanner = Exclude<`banner.${ColorBanner}`, "">;

export type ColorStroke = keyof TokenObject["$color"]["stroke"];

// Workaround for type docgen enumerating all possible values
export type ScopedColorStroke = Exclude<`stroke.${ColorStroke}`, "">;

export type ColorPalette = keyof TokenObject["$color"]["palette"];

// Workaround for type docgen enumerating all possible values
export type ScopedColorPalette = Exclude<`palette.${ColorPalette}`, "">;

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

export type Shadow = keyof TokenObject["$shadow"];
