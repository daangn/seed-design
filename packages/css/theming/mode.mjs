export const ColorModeValues = Object.freeze(["system", "light-only", "dark-only"]);
export const DefaultColorModeValue = ColorModeValues[0];

export function isValidColorMode(mode) {
  return ColorModeValues.includes(mode);
}
