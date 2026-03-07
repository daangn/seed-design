import type { LynxCompatConfig } from "./types";

export const defaultConfig: Required<LynxCompatConfig> = {
  remove: {
    // 브라우저 리셋 / 웹 전용
    cursor: "Lynx는 터치 전용, 커서 불필요",
    "box-sizing": "Lynx 기본값이 border-box",
    "text-transform": "Lynx에서 미지원",
    "-webkit-font-smoothing": "Lynx 네이티브 렌더링이 자동 처리",
    "-moz-osx-font-smoothing": "Lynx 네이티브 렌더링이 자동 처리",
    "vertical-align": "Lynx flex 레이아웃에서 불필요",
    "will-change": "Lynx 네이티브 GPU 관리가 자동 처리",
    isolation: "Lynx에서 미지원",
    "user-select": "Lynx에서 미지원",
    appearance: "Lynx에서 미지원",
    "-webkit-appearance": "Lynx에서 미지원",
    "-ms-overflow-style": "IE/Edge 전용, Lynx에 불필요",
    "scrollbar-width": "Firefox 전용, Lynx에 불필요",
    "text-decoration": "리셋 목적의 text-decoration: none, Lynx에 불필요",
    "white-space": "Lynx <text>는 기본 wrap 동작",
    "word-break": "Lynx에서 부분 지원",
    "-webkit-tap-highlight-color": "웹킷 전용, Lynx에 불필요",
    "backface-visibility": "Lynx에서 미지원",
    "-webkit-backface-visibility": "웹킷 전용, Lynx에 불필요",
    "font-feature-settings": "Lynx에서 미지원",
    "font-variation-settings": "Lynx에서 미지원",
    contain: "Lynx에서 미지원",
    "content-visibility": "Lynx에서 미지원",
    // Grid shorthand → Lynx는 longhand만 지원
    "grid-column": "Lynx에서 미지원, grid-column-start/end 사용",
    "grid-row": "Lynx에서 미지원, grid-row-start/end 사용",
    // 웹 전용 / Lynx 미지원
    "color-scheme": "Lynx는 네이티브 테마 시스템 사용",
    content: "Lynx에서 ::before/::after 미지원",
    font: "Lynx에서 font shorthand 미지원, 개별 프로퍼티 사용",
    "stroke-dasharray": "Lynx에서 SVG stroke 미지원",
    "stroke-dashoffset": "Lynx에서 SVG stroke 미지원",
    stroke: "Lynx에서 SVG stroke 미지원",
    "stroke-linecap": "Lynx에서 SVG stroke 미지원",
    fill: "Lynx에서 SVG fill 미지원",
    // CSS Logical Properties → Lynx는 physical만 지원
    "padding-block": "Lynx에서 미지원, padding-top/bottom 사용",
    "padding-inline": "Lynx에서 미지원, padding-left/right 사용",
    "margin-block": "Lynx에서 미지원, margin-top/bottom 사용",
    // 텍스트 관련
    "overflow-wrap": "Lynx에서 미지원",
    "line-break": "Lynx에서 미지원",
    "text-decoration-line": "Lynx에서 미지원",
    "text-underline-offset": "Lynx에서 미지원",
    resize: "Lynx에서 미지원",
    "outline-offset": "Lynx에서 미지원",
    outline: "Lynx에서 미지원",
    "outline-color": "Lynx에서 미지원",
    "outline-style": "Lynx에서 미지원",
    "outline-width": "Lynx에서 미지원",
    "object-fit": "Lynx에서 미지원",
    "object-position": "Lynx에서 미지원",
    translate: "Lynx에서 미지원, transform: translate() 사용",
    // Mask (표준 + webkit)
    "mask-image": "Lynx에서 미지원",
    "mask-size": "Lynx에서 미지원",
    "mask-position": "Lynx에서 미지원",
    "mask-repeat": "Lynx에서 미지원",
    "mask-composite": "Lynx에서 미지원",
    "-webkit-mask-image": "Lynx에서 미지원",
    "-webkit-mask-size": "Lynx에서 미지원",
    "-webkit-mask-position": "Lynx에서 미지원",
    "-webkit-mask-repeat": "Lynx에서 미지원",
    "-webkit-mask-composite": "Lynx에서 미지원",
    // 웹킷 전용
    "-webkit-line-clamp": "Lynx에서 미지원",
    "-webkit-box-orient": "Lynx에서 미지원",
    "-webkit-overflow-scrolling": "Lynx 네이티브 스크롤이 자동 처리",
    // 터치/스크롤 관련
    "overscroll-behavior": "Lynx에서 미지원, <scroll-view bounces> 사용",
    "overscroll-behavior-x": "Lynx에서 미지원, <scroll-view bounces> 사용",
    "overscroll-behavior-y": "Lynx에서 미지원, <scroll-view bounces> 사용",
    "touch-action": "Lynx에서 미지원, Gesture API 사용",
  },

  transformSelectors: {
    ":--engaged": "[data-active]",
    ":is(:disabled, [disabled], [data-disabled])": "[data-disabled]",
    ":is(:active, [data-active])": "[data-active]",
    ":is(:hover, [data-hover])": "[data-hover]",
  },

  removeAtRules: ["(hover: hover)", "(hover: none)"],

  removeSelectors: [":focus-visible", "::-webkit-scrollbar", "::placeholder", ":-webkit-autofill"],

  suggestions: {},

  supportedProperties: [
    // Layout & Positioning
    "display",
    "position",
    "top",
    "bottom",
    "left",
    "right",
    "width",
    "height",
    "min-width",
    "max-width",
    "min-height",
    "max-height",
    "margin",
    "margin-top",
    "margin-bottom",
    "margin-left",
    "margin-right",
    "margin-inline-start",
    "margin-inline-end",
    "padding",
    "padding-top",
    "padding-bottom",
    "padding-left",
    "padding-right",
    "padding-inline-start",
    "padding-inline-end",
    "inset-inline-start",
    "inset-inline-end",
    "z-index",
    "visibility",
    "aspect-ratio",
    "overflow",
    "overflow-x",
    "overflow-y",

    // Flex
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "justify-content",
    "justify-items",
    "justify-self",
    "align-content",
    "align-items",
    "align-self",
    "gap",
    "row-gap",
    "column-gap",
    "order",

    // Grid (개별 프로퍼티만)
    "grid-template-columns",
    "grid-template-rows",
    "grid-auto-columns",
    "grid-auto-rows",
    "grid-auto-flow",
    "grid-column-start",
    "grid-column-end",
    "grid-row-start",
    "grid-row-end",

    // Text & Font
    "color",
    "font-family",
    "font-size",
    "font-weight",
    "font-style",
    "letter-spacing",
    "line-height",
    "text-align",
    "text-overflow",
    "text-shadow",
    "direction",

    // Visual
    "background",
    "background-color",
    "background-image",
    "background-size",
    "background-position",
    "background-repeat",
    "background-clip",
    "background-origin",
    "border",
    "border-width",
    "border-style",
    "border-color",
    "border-radius",
    "border-top",
    "border-bottom",
    "border-left",
    "border-right",
    "border-top-width",
    "border-bottom-width",
    "border-left-width",
    "border-right-width",
    "border-top-style",
    "border-bottom-style",
    "border-left-style",
    "border-right-style",
    "border-top-color",
    "border-bottom-color",
    "border-left-color",
    "border-right-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "box-shadow",
    "opacity",
    "filter",

    // Transform & Animation
    "transform",
    "transform-origin",
    "transition",
    "transition-duration",
    "transition-delay",
    "transition-property",
    "transition-timing-function",
    "animation",
    "animation-name",
    "animation-duration",
    "animation-delay",
    "animation-direction",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-play-state",
    "animation-timing-function",

    // Other
    "clip-path",
    "pointer-events",
    "image-rendering",
  ],

  expandShorthands: {
    // inset: <value> → top/right/bottom/left 개별 프로퍼티로 확장
    inset: (value: string) => {
      const parts = value.split(/\s+/);
      let top: string;
      let right: string;
      let bottom: string;
      let left: string;

      if (parts.length === 1) {
        top = right = bottom = left = parts[0];
      } else if (parts.length === 2) {
        top = bottom = parts[0];
        right = left = parts[1];
      } else if (parts.length === 3) {
        top = parts[0];
        right = left = parts[1];
        bottom = parts[2];
      } else {
        top = parts[0];
        right = parts[1];
        bottom = parts[2];
        left = parts[3];
      }

      return [
        { prop: "top", value: top },
        { prop: "right", value: right },
        { prop: "bottom", value: bottom },
        { prop: "left", value: left },
      ];
    },
  },

  clampStrategy: "preferred",

  warnOnly: false,

  textSlot: {
    suffix: "__text",
    textProperties: [
      "color",
      "font-family",
      "font-size",
      "font-weight",
      "font-style",
      "line-height",
      "letter-spacing",
      "text-align",
      "text-overflow",
      "text-shadow",
      "direction",
    ],
    sharedProperties: [
      "opacity",
      "transform",
      "transform-origin",
      "transition",
      "transition-property",
      "transition-duration",
      "transition-delay",
      "transition-timing-function",
      "pointer-events",
    ],
  },
};
