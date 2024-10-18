export const VARIABLE_TABLE_NAMES = {
  DEFAULT: "Tokens",
  PALETTES: "Palettes",
} as const satisfies Record<Uppercase<string>, string>;

export const FILLS = {
  DARK: { type: "SOLID", color: { r: 0.102, g: 0.11, b: 0.125 } },
  DARK_FADED: { type: "SOLID", color: { r: 0.0706, g: 0.0706, b: 0.0706 } },
  LIGHT: { type: "SOLID", color: { r: 1, g: 1, b: 1 } },
  LIGHT_FADED: { type: "SOLID", color: { r: 0.969, g: 0.973, b: 0.976 } },
} as const satisfies Record<Uppercase<string>, SolidPaint>;

export const FONT_FAMILIES = {
  REGULAR: { family: "Figma Only iOS Text", style: "Regular" },
  BOLD: { family: "Figma Only iOS Text", style: "Bold" },
} as const satisfies Record<Uppercase<string>, FontName>;

export const FONT_SIZES = {
  XXL: 48,
  XL: 32,
  LG: 24,
  BASE: 13,
} as const satisfies Record<Uppercase<string>, TextNode["fontSize"]>;

export const SIZES = {
  CELL_WIDTH: 280,
  CELL_HEIGHT: 44,
} as const satisfies Record<Uppercase<string>, FrameNode["width"] | FrameNode["height"]>;

export const RELAUNCH_DATA_MESSAGES = {
  ADD: "페이지에 Variable 프리뷰 프레임을 추가해요",
  UPDATE: "이 프리뷰 프레임을 Variable 변경 사항에 맞추어 업데이트해요",
} as const satisfies Record<Uppercase<string>, string>;
