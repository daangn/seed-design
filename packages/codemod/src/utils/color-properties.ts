/**
 * 색상을 사용하는 모든 CSS 속성을 카테고리별로 분류합니다.
 */
export const COLOR_PROPERTIES = {
  /**
   * 텍스트 관련 색상 속성 (fg 토큰으로 매핑됨)
   * 텍스트, 아이콘 등 UI의 전경 요소에 사용하는 색상
   */
  text: [
    "color",
    "textColor",
    "textDecorationColor",
    "textEmphasisColor",
    "caretColor",
    "webkitTextFillColor",
    "webkitTextStrokeColor",
    "currentColor",
    "cue",
    "cueAfter",
    "cueBefore",
    "cursor",
    "markColor",
    "spellingErrorColor",
    "grammarErrorColor",
    "textFillColor",
    "textStrokeColor",
    "footnoteColor",
    "rubyColor",
    "markerForeground",
    "scrollbarThumbColor",
    "caretColor",
    "selectionColor",
    "marks",
  ],

  /**
   * 배경 관련 색상 속성 (bg 토큰으로 매핑됨)
   * 전체 화면 또는 UI의 배경에 사용하는 색상
   */
  background: [
    "background",
    "backgroundColor",
    "backgroundImage",
    "backgroundBlendMode",
    "webkitBackgroundClip",
    "webkitBackgroundOrigin",
    "webkitBackgroundSize",
    "gradient",
    "gradientImage",
    "pageBackgroundColor",
    "breakColor",
    "columnRuleColor",
    "canvasBackground",
    "layerBackground",
    "counterFillColor",
    "markerBackground",
    "scrollbarColor",
    "scrollbarButtonColor",
    "scrollbarTrackColor",
    "scrollbarTrackPieceColor",
    "highlightBackground",
    "screenBackgroundColor",
    "printBackgroundColor",
  ],

  /**
   * 테두리 관련 색상 속성 (stroke 토큰으로 매핑, 혹은 fg 토큰으로 매핑)
   * 경계를 구분하는 선 또는 UI 요소의 윤곽선에 사용하는 색상
   */
  border: [
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "borderBlockColor",
    "borderBlockEndColor",
    "borderBlockStartColor",
    "borderInlineColor",
    "borderInlineEndColor",
    "borderInlineStartColor",
    "border",
    "borderTop",
    "borderRight",
    "borderBottom",
    "borderLeft",
    "borderBlock",
    "borderBlockEnd",
    "borderBlockStart",
    "borderInline",
    "borderInlineEnd",
    "borderInlineStart",
    "columnRuleColor",
    "gridColumnRule",
    "gridRowRule",
    "outlineButton",
    "outlineFieldset",
    "outlineMenu",
    "outlineWindow",
    "rubyOverhang",
    "scrollbarArrowColor",
    "scrollbarBaseColor",
    "scrollbarDarkShadowColor",
    "scrollbarFaceColor",
    "scrollbarHighlightColor",
    "scrollbarShadowColor",
    "scrollbarBorderColor",
    "windowFrame",
  ],

  /**
   * 아웃라인 관련 색상 속성 (stroke 토큰 혹은 fg 토큰으로 매핑됨)
   * 경계를 구분하는 선에 사용하는 색상
   */
  outline: [
    "outlineColor",
    "outline",
    "outlineFocus",
    "outlineOffset",
    "focusOutlineColor",
    "focusRingColor",
  ],

  /**
   * 그림자 관련 색상 속성 (특별 처리 필요)
   */
  shadow: [
    "boxShadow",
    "textShadow",
    "dropShadow",
    "webkitBoxShadow",
    "mozBoxShadow",
    "shadowColor",
    "textShadowColor",
  ],

  /**
   * SVG 관련 색상 속성
   * fill, fillColor은 fg 토큰으로 매핑
   * stroke은 stroke 토큰으로 매핑
   */
  svg: [
    "fill",
    "fillColor",
    "stroke",
    "floodColor",
    "lightingColor",
    "stopColor",
    "colorInterpolation",
    "colorInterpolationFilters",
    "colorProfile",
    "colorRendering",
    "marker",
    "markerEnd",
    "markerMid",
    "markerStart",
    "paintOrder",
    "shapeRendering",
    "strokeColor",
    "strokeDashcolor",
    "strokeLinecap",
    "strokeLinejoin",
    "strokeOpacity",
    "vectorEffect",
  ],

  /**
   * 기타 색상 속성
   */
  misc: [
    "accentColor",
    "scrollbarColor",
    "columnRuleColor",
    "textDecoration",
    "maskColor",
    "maskBorderColor",
    "outlineOffset",
    "filter", // drop-shadow 필터 등에서 색상이 사용될 수 있음
    "backdropFilter",
    "appearance",
    "containerType",
    "colorScheme",
    "contentVisibility",
    "counterIncrement",
    "counterReset",
    "counterSet",
    "forcedColorAdjust",
    "imageRendering",
    "isolation",
    "mixBlendMode",
    "objectFit",
    "opacity",
    "perspective",
    "perspectiveOrigin",
    "printColorAdjust",
    "quotes",
    "resize",
    "tabSize",
    "unicodeBidi",
    "willChange",
    "writingMode",
    "zoom",
    "colorGamut",
    "colorScheme",
    "invertedColors",
    "prefersColorScheme",
  ],
};

/**
 * 배경 관련 속성 모음 (bg 토큰으로 매핑됨)
 */
export const COLOR_BACKGROUND_PROPERTIES = [
  ...COLOR_PROPERTIES.background,
  ...COLOR_PROPERTIES.svg.filter((prop) => prop !== "fill" && prop !== "fillColor"),
  "backgroundColor",
  "backgroundImage",
];

/**
 * 텍스트 관련 속성 모음 (fg 토큰으로 매핑됨)
 */
export const COLOR_TEXT_PROPERTIES = [...COLOR_PROPERTIES.text, "color", "fill", "fillColor"];

/**
 * 테두리 관련 속성 모음 (stroke 토큰으로 매핑됨)
 */
export const COLOR_STROKE_PROPERTIES = [
  ...COLOR_PROPERTIES.border,
  ...COLOR_PROPERTIES.outline,
  "stroke",
  "borderColor",
  "outlineColor",
];

/**
 * 속성 이름이 배경 속성인지 확인하는 함수
 */
export function isBackgroundProperty(propertyName?: string): boolean {
  if (!propertyName) return false;

  // SVG 아이콘의 fill 속성은 배경으로 처리하지 않음
  if (propertyName === "fill" || propertyName === "fillColor") {
    return false;
  }

  // backgroundColor는 항상 배경 속성으로 처리
  if (
    propertyName === "backgroundColor" ||
    propertyName === "background" ||
    propertyName === "backgroundImage"
  ) {
    return true;
  }

  return COLOR_BACKGROUND_PROPERTIES.includes(propertyName);
}

/**
 * 속성 이름이 텍스트 속성인지 확인하는 함수
 */
export function isFgProperty(propertyName?: string): boolean {
  if (!propertyName) return false;
  return COLOR_TEXT_PROPERTIES.includes(propertyName);
}

/**
 * 속성 이름이 테두리 속성인지 확인하는 함수
 */
export function isStrokeProperty(propertyName?: string): boolean {
  if (!propertyName) return false;
  return COLOR_STROKE_PROPERTIES.includes(propertyName);
}

/**
 * 속성의 이름을 기반으로 적절한 토큰 타입을 반환합니다.
 * 이 함수는 주어진 속성에 대해 가장 적합한 토큰 타입(bg, fg, stroke)을 결정합니다.
 *
 * @param propertyName CSS 속성 이름
 * @returns 토큰 타입 ("bg" | "fg" | "stroke" | "palette")
 */
export function getTokenTypeForProperty(propertyName?: string): "bg" | "fg" | "stroke" | "palette" {
  if (!propertyName) return "palette"; // 속성 이름이 없으면 palette 토큰 사용

  if (isStrokeProperty(propertyName)) return "stroke";
  if (isFgProperty(propertyName)) return "fg";
  if (isBackgroundProperty(propertyName)) return "bg";

  // 기본값으로 palette 토큰 사용
  return "palette";
}
