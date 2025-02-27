export const VARIABLE_TABLE_HEADER_TITLE = "SEED V3" as const satisfies TextNode["characters"];

export const VARIABLE_TABLE_NAMES = {
  DEFAULT: "Semantic",
  PALETTES: "Palettes",
} as const satisfies Record<Uppercase<string>, string>;

export const VARIABLE_TABLE_NAME_HYPERLINKS = {
  Semantic: "https://seed-design.io/docs/design/foundation/color/palette",
  Palettes: "https://seed-design.io/docs/design/foundation/color/palette",
} as const satisfies Record<
  (typeof VARIABLE_TABLE_NAMES)[keyof typeof VARIABLE_TABLE_NAMES],
  HyperlinkTarget["value"]
>;

export const FILLS = {
  NOOP: { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
  DARK: { type: "SOLID", color: { r: 0.102, g: 0.11, b: 0.125 } },
  DARK_FADED: { type: "SOLID", color: { r: 0.0706, g: 0.0706, b: 0.0706 } },
  LIGHT: { type: "SOLID", color: { r: 1, g: 1, b: 1 } },
  LIGHT_FADED: { type: "SOLID", color: { r: 0.969, g: 0.973, b: 0.976 } },
} as const satisfies Record<Uppercase<string>, SolidPaint>;

export const VARIABLE_NAMES = {
  TABLE_METADATA_FOREGROUND: "fg/neutral",
  PREVIEW_STROKE: "stroke/neutral-muted",
} as const satisfies Record<Uppercase<string>, Variable["name"]>;

export const FONT_FAMILIES = {
  FIGMA_TEXT_REGULAR: { family: "Figma Only iOS Text", style: "Regular" },
  FIGMA_TEXT_BOLD: { family: "Figma Only iOS Text", style: "Bold" },
  SF_PRO_BOLD: { family: "SF Pro", style: "Bold" },
  SF_PRO_TEXT_BOLD: { family: "SF Pro Text", style: "Bold" },
} as const satisfies Record<Uppercase<string>, FontName>;

export const FONT_SIZES = {
  XXL: 56,
  XL: 32,
  LG: 24,
  BASE: 13,
} as const satisfies Record<Uppercase<string>, TextNode["fontSize"]>;

export const SIZES = {
  CELL_WIDTH: 280,
  CELL_HEIGHT: 44,
} as const satisfies Record<Uppercase<string>, FrameNode["width"] | FrameNode["height"]>;

export const RELAUNCH_DATA_MESSAGES = {
  UPDATE: "이 프리뷰 프레임을 Variable 변경 사항에 맞추어 업데이트해요",
} as const satisfies Record<Uppercase<string>, string>;

export const COMMANDS = {
  ADD_COLOR_VARIABLE_PREVIEW_FRAME: "add-color-variable-preview-frame",
  ADD_COLOR_VARIABLE_PREVIEW_FRAME_WITHOUT_COMBINATIONS:
    "add-color-variable-preview-frame-without-combinations",
} as const satisfies Record<Uppercase<string>, PluginAPI["command"]>;
