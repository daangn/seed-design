const ColorModeValues = Object.freeze(["system", "light-only", "dark-only"]);
const DefaultColorModeValue = ColorModeValues[0];

function isValidColorMode(mode) {
  return ColorModeValues.includes(mode);
}

module.exports = {
  ColorModeValues,
  DefaultColorModeValue,
  isValidColorMode,
};
