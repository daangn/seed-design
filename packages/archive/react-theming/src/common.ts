export const ColorModeValues = Object.freeze(["auto", "light-only", "dark-only"] as const);
export const DefaultColorModeValue = ColorModeValues[0];
export type ColorMode = (typeof ColorModeValues)[number];

export const StorageKey = {
  COLOR: "@seed-design/scale-color",
  PLATFORM: "@seed-design/platform",
} as const;
