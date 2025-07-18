// @ts-nocheck
import plugin from "tailwindcss/plugin";

/**
 * Seed Design 디자인 토큰을 위한 Tailwind CSS 플러그인
 * 색상 토큰과 타이포그래피 토큰을 클래스 이름으로 사용할 수 있습니다
 * 예시: 
 * - 색상: bg-bg-layer-basement, text-fg-brand, border-stroke-divider
 * - 타이포그래피: t1-regular, t1-bold, screen-title
 * - 그라데이션: 
 *   * bg-gradient-shimmer-neutral-to-r (방향성 포함)
 *   * bg-gradient-shimmer-neutral-[45deg] (임의 각도)
 * 
 * 모든 토큰은 CSS 변수를 사용하여 다크 모드와 자동 호환됩니다.
 */
export default plugin(
  ({ theme, addComponents, matchUtilities }) => {  
    // typography 유틸리티
    const typography = theme("typography");
    if (typography) {
      addComponents(
        Object.entries(typography).reduce((acc, [key, value]) => {
          acc[`.${key}`] = value;
          return acc;
        }, {})
      );
    }

    // gradient arbitrary value 지원
    const gradientStopsForArbitrary = {
      "fade-layer-floating": "#ffffff00 0.00%, #000000 100.00%",
      "fade-layer-default": "#ffffff00 0.00%, #000000 100.00%",
      "glow-magic": "#fef6f7 0.00%, #fef0e7 80.00%, #f9f7f5 100.00%",
      "shimmer-magic": "#fff9f500 0.00%, #fff9f58a 46.00%, #fff9f58a 54.00%, #fff9f500 100.00%",
      "glow-magic-pressed": "#fbf0f2 0.00%, #ffe8db 80.00%, #f5f2ef 100.00%",
      "shimmer-neutral": "#ffffff00 0.00%, #ffffff66 46.00%, #ffffff66 54.00%, #ffffff00 100.00%",
      "highlight-magic": "#ff6600 20.00%, #d25aca 100.00%"
};

    Object.entries(gradientStopsForArbitrary).forEach(([gradientName, colorStops]) => {
      matchUtilities(
        {
          [`bg-gradient-${gradientName}`]: (value) => ({
            backgroundImage: `linear-gradient(${value}, ${colorStops})`
          })
        },
        {
          type: 'any',
          values: {}
        }
      );
    });
  },
  {
    theme: {
      extend: {
        colors: {
  "palette-blue-100": "var(--seed-color-palette-blue-100)",
  "palette-blue-200": "var(--seed-color-palette-blue-200)",
  "palette-blue-300": "var(--seed-color-palette-blue-300)",
  "palette-blue-400": "var(--seed-color-palette-blue-400)",
  "palette-blue-500": "var(--seed-color-palette-blue-500)",
  "palette-blue-600": "var(--seed-color-palette-blue-600)",
  "palette-blue-700": "var(--seed-color-palette-blue-700)",
  "palette-blue-800": "var(--seed-color-palette-blue-800)",
  "palette-blue-900": "var(--seed-color-palette-blue-900)",
  "palette-blue-1000": "var(--seed-color-palette-blue-1000)",
  "palette-carrot-100": "var(--seed-color-palette-carrot-100)",
  "palette-carrot-200": "var(--seed-color-palette-carrot-200)",
  "palette-carrot-300": "var(--seed-color-palette-carrot-300)",
  "palette-carrot-400": "var(--seed-color-palette-carrot-400)",
  "palette-carrot-500": "var(--seed-color-palette-carrot-500)",
  "palette-carrot-600": "var(--seed-color-palette-carrot-600)",
  "palette-carrot-700": "var(--seed-color-palette-carrot-700)",
  "palette-carrot-800": "var(--seed-color-palette-carrot-800)",
  "palette-carrot-900": "var(--seed-color-palette-carrot-900)",
  "palette-carrot-1000": "var(--seed-color-palette-carrot-1000)",
  "palette-gray-00": "var(--seed-color-palette-gray-00)",
  "palette-gray-100": "var(--seed-color-palette-gray-100)",
  "palette-gray-200": "var(--seed-color-palette-gray-200)",
  "palette-gray-300": "var(--seed-color-palette-gray-300)",
  "palette-gray-400": "var(--seed-color-palette-gray-400)",
  "palette-gray-500": "var(--seed-color-palette-gray-500)",
  "palette-gray-600": "var(--seed-color-palette-gray-600)",
  "palette-gray-700": "var(--seed-color-palette-gray-700)",
  "palette-gray-800": "var(--seed-color-palette-gray-800)",
  "palette-gray-900": "var(--seed-color-palette-gray-900)",
  "palette-gray-1000": "var(--seed-color-palette-gray-1000)",
  "palette-green-100": "var(--seed-color-palette-green-100)",
  "palette-green-200": "var(--seed-color-palette-green-200)",
  "palette-green-300": "var(--seed-color-palette-green-300)",
  "palette-green-400": "var(--seed-color-palette-green-400)",
  "palette-green-500": "var(--seed-color-palette-green-500)",
  "palette-green-600": "var(--seed-color-palette-green-600)",
  "palette-green-700": "var(--seed-color-palette-green-700)",
  "palette-green-800": "var(--seed-color-palette-green-800)",
  "palette-green-900": "var(--seed-color-palette-green-900)",
  "palette-green-1000": "var(--seed-color-palette-green-1000)",
  "palette-purple-100": "var(--seed-color-palette-purple-100)",
  "palette-purple-200": "var(--seed-color-palette-purple-200)",
  "palette-purple-300": "var(--seed-color-palette-purple-300)",
  "palette-purple-400": "var(--seed-color-palette-purple-400)",
  "palette-purple-500": "var(--seed-color-palette-purple-500)",
  "palette-purple-600": "var(--seed-color-palette-purple-600)",
  "palette-purple-700": "var(--seed-color-palette-purple-700)",
  "palette-purple-800": "var(--seed-color-palette-purple-800)",
  "palette-purple-900": "var(--seed-color-palette-purple-900)",
  "palette-purple-1000": "var(--seed-color-palette-purple-1000)",
  "palette-red-100": "var(--seed-color-palette-red-100)",
  "palette-red-200": "var(--seed-color-palette-red-200)",
  "palette-red-300": "var(--seed-color-palette-red-300)",
  "palette-red-400": "var(--seed-color-palette-red-400)",
  "palette-red-500": "var(--seed-color-palette-red-500)",
  "palette-red-600": "var(--seed-color-palette-red-600)",
  "palette-red-700": "var(--seed-color-palette-red-700)",
  "palette-red-800": "var(--seed-color-palette-red-800)",
  "palette-red-900": "var(--seed-color-palette-red-900)",
  "palette-red-1000": "var(--seed-color-palette-red-1000)",
  "palette-static-black": "var(--seed-color-palette-static-black)",
  "palette-static-white": "var(--seed-color-palette-static-white)",
  "palette-static-black-alpha-100": "var(--seed-color-palette-static-black-alpha-100)",
  "palette-static-black-alpha-200": "var(--seed-color-palette-static-black-alpha-200)",
  "palette-static-black-alpha-300": "var(--seed-color-palette-static-black-alpha-300)",
  "palette-static-black-alpha-400": "var(--seed-color-palette-static-black-alpha-400)",
  "palette-static-black-alpha-500": "var(--seed-color-palette-static-black-alpha-500)",
  "palette-static-black-alpha-600": "var(--seed-color-palette-static-black-alpha-600)",
  "palette-static-black-alpha-700": "var(--seed-color-palette-static-black-alpha-700)",
  "palette-static-black-alpha-800": "var(--seed-color-palette-static-black-alpha-800)",
  "palette-static-black-alpha-900": "var(--seed-color-palette-static-black-alpha-900)",
  "palette-static-black-alpha-1000": "var(--seed-color-palette-static-black-alpha-1000)",
  "palette-static-white-alpha-50": "var(--seed-color-palette-static-white-alpha-50)",
  "palette-static-white-alpha-100": "var(--seed-color-palette-static-white-alpha-100)",
  "palette-static-white-alpha-200": "var(--seed-color-palette-static-white-alpha-200)",
  "palette-static-white-alpha-300": "var(--seed-color-palette-static-white-alpha-300)",
  "palette-static-white-alpha-400": "var(--seed-color-palette-static-white-alpha-400)",
  "palette-static-white-alpha-500": "var(--seed-color-palette-static-white-alpha-500)",
  "palette-static-white-alpha-600": "var(--seed-color-palette-static-white-alpha-600)",
  "palette-static-white-alpha-700": "var(--seed-color-palette-static-white-alpha-700)",
  "palette-static-white-alpha-800": "var(--seed-color-palette-static-white-alpha-800)",
  "palette-static-white-alpha-900": "var(--seed-color-palette-static-white-alpha-900)",
  "palette-static-white-alpha-1000": "var(--seed-color-palette-static-white-alpha-1000)",
  "palette-yellow-100": "var(--seed-color-palette-yellow-100)",
  "palette-yellow-200": "var(--seed-color-palette-yellow-200)",
  "palette-yellow-300": "var(--seed-color-palette-yellow-300)",
  "palette-yellow-400": "var(--seed-color-palette-yellow-400)",
  "palette-yellow-500": "var(--seed-color-palette-yellow-500)",
  "palette-yellow-600": "var(--seed-color-palette-yellow-600)",
  "palette-yellow-700": "var(--seed-color-palette-yellow-700)",
  "palette-yellow-800": "var(--seed-color-palette-yellow-800)",
  "palette-yellow-900": "var(--seed-color-palette-yellow-900)",
  "palette-yellow-1000": "var(--seed-color-palette-yellow-1000)",
  "fg-brand": "var(--seed-color-fg-brand)",
  "fg-critical": "var(--seed-color-fg-critical)",
  "fg-disabled": "var(--seed-color-fg-disabled)",
  "fg-informative": "var(--seed-color-fg-informative)",
  "fg-neutral": "var(--seed-color-fg-neutral)",
  "fg-placeholder": "var(--seed-color-fg-placeholder)",
  "fg-positive": "var(--seed-color-fg-positive)",
  "fg-critical-contrast": "var(--seed-color-fg-critical-contrast)",
  "fg-informative-contrast": "var(--seed-color-fg-informative-contrast)",
  "fg-neutral-inverted": "var(--seed-color-fg-neutral-inverted)",
  "fg-neutral-muted": "var(--seed-color-fg-neutral-muted)",
  "fg-neutral-subtle": "var(--seed-color-fg-neutral-subtle)",
  "fg-positive-contrast": "var(--seed-color-fg-positive-contrast)",
  "fg-warning-contrast": "var(--seed-color-fg-warning-contrast)",
  "bg-disabled": "var(--seed-color-bg-disabled)",
  "bg-overlay": "var(--seed-color-bg-overlay)",
  "bg-brand-solid": "var(--seed-color-bg-brand-solid)",
  "bg-brand-solid-pressed": "var(--seed-color-bg-brand-solid-pressed)",
  "bg-critical-solid": "var(--seed-color-bg-critical-solid)",
  "bg-critical-weak": "var(--seed-color-bg-critical-weak)",
  "bg-critical-solid-pressed": "var(--seed-color-bg-critical-solid-pressed)",
  "bg-critical-weak-pressed": "var(--seed-color-bg-critical-weak-pressed)",
  "bg-informative-solid": "var(--seed-color-bg-informative-solid)",
  "bg-informative-weak": "var(--seed-color-bg-informative-weak)",
  "bg-informative-solid-pressed": "var(--seed-color-bg-informative-solid-pressed)",
  "bg-informative-weak-pressed": "var(--seed-color-bg-informative-weak-pressed)",
  "bg-layer-basement": "var(--seed-color-bg-layer-basement)",
  "bg-layer-default": "var(--seed-color-bg-layer-default)",
  "bg-layer-fill": "var(--seed-color-bg-layer-fill)",
  "bg-layer-floating": "var(--seed-color-bg-layer-floating)",
  "bg-layer-default-pressed": "var(--seed-color-bg-layer-default-pressed)",
  "bg-layer-floating-pressed": "var(--seed-color-bg-layer-floating-pressed)",
  "bg-magic-weak": "var(--seed-color-bg-magic-weak)",
  "bg-neutral-inverted": "var(--seed-color-bg-neutral-inverted)",
  "bg-neutral-solid": "var(--seed-color-bg-neutral-solid)",
  "bg-neutral-weak": "var(--seed-color-bg-neutral-weak)",
  "bg-neutral-inverted-pressed": "var(--seed-color-bg-neutral-inverted-pressed)",
  "bg-neutral-solid-muted": "var(--seed-color-bg-neutral-solid-muted)",
  "bg-neutral-solid-muted-pressed": "var(--seed-color-bg-neutral-solid-muted-pressed)",
  "bg-neutral-weak-pressed": "var(--seed-color-bg-neutral-weak-pressed)",
  "bg-overlay-muted": "var(--seed-color-bg-overlay-muted)",
  "bg-positive-solid": "var(--seed-color-bg-positive-solid)",
  "bg-positive-weak": "var(--seed-color-bg-positive-weak)",
  "bg-positive-solid-pressed": "var(--seed-color-bg-positive-solid-pressed)",
  "bg-positive-weak-pressed": "var(--seed-color-bg-positive-weak-pressed)",
  "bg-warning-solid": "var(--seed-color-bg-warning-solid)",
  "bg-warning-weak": "var(--seed-color-bg-warning-weak)",
  "bg-warning-weak-pressed": "var(--seed-color-bg-warning-weak-pressed)",
  "stroke-brand": "var(--seed-color-stroke-brand)",
  "stroke-control": "var(--seed-color-stroke-control)",
  "stroke-critical": "var(--seed-color-stroke-critical)",
  "stroke-field": "var(--seed-color-stroke-field)",
  "stroke-informative": "var(--seed-color-stroke-informative)",
  "stroke-neutral": "var(--seed-color-stroke-neutral)",
  "stroke-positive": "var(--seed-color-stroke-positive)",
  "stroke-field-focused": "var(--seed-color-stroke-field-focused)",
  "stroke-neutral-muted": "var(--seed-color-stroke-neutral-muted)",
  "stroke-on-image": "var(--seed-color-stroke-on-image)",
  "manner-temp-l1-bg": "var(--seed-color-manner-temp-l1-bg)",
  "manner-temp-l1-text": "var(--seed-color-manner-temp-l1-text)",
  "manner-temp-l2-bg": "var(--seed-color-manner-temp-l2-bg)",
  "manner-temp-l2-text": "var(--seed-color-manner-temp-l2-text)",
  "manner-temp-l3-bg": "var(--seed-color-manner-temp-l3-bg)",
  "manner-temp-l3-text": "var(--seed-color-manner-temp-l3-text)",
  "manner-temp-l4-bg": "var(--seed-color-manner-temp-l4-bg)",
  "manner-temp-l4-text": "var(--seed-color-manner-temp-l4-text)",
  "manner-temp-l5-bg": "var(--seed-color-manner-temp-l5-bg)",
  "manner-temp-l5-text": "var(--seed-color-manner-temp-l5-text)",
  "manner-temp-l6-bg": "var(--seed-color-manner-temp-l6-bg)",
  "manner-temp-l6-text": "var(--seed-color-manner-temp-l6-text)",
  "gradient-stops-fade-layer-floating": "#ffffff00 0.00%, #000000 100.00%",
  "gradient-stops-fade-layer-default": "#ffffff00 0.00%, #000000 100.00%",
  "gradient-stops-glow-magic": "#fef6f7 0.00%, #fef0e7 80.00%, #f9f7f5 100.00%",
  "gradient-stops-shimmer-magic": "#fff9f500 0.00%, #fff9f58a 46.00%, #fff9f58a 54.00%, #fff9f500 100.00%",
  "gradient-stops-glow-magic-pressed": "#fbf0f2 0.00%, #ffe8db 80.00%, #f5f2ef 100.00%",
  "gradient-stops-shimmer-neutral": "#ffffff00 0.00%, #ffffff66 46.00%, #ffffff66 54.00%, #ffffff00 100.00%",
  "gradient-stops-highlight-magic": "#ff6600 20.00%, #d25aca 100.00%"
},
        backgroundImage: {
  "fade-layer-floating-to-t": "linear-gradient(to top, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-floating-to-tr": "linear-gradient(to top right, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-floating-to-r": "linear-gradient(to right, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-floating-to-br": "linear-gradient(to bottom right, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-floating-to-b": "linear-gradient(to bottom, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-floating-to-bl": "linear-gradient(to bottom left, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-floating-to-l": "linear-gradient(to left, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-floating-to-tl": "linear-gradient(to top left, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-default-to-t": "linear-gradient(to top, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-default-to-tr": "linear-gradient(to top right, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-default-to-r": "linear-gradient(to right, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-default-to-br": "linear-gradient(to bottom right, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-default-to-b": "linear-gradient(to bottom, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-default-to-bl": "linear-gradient(to bottom left, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-default-to-l": "linear-gradient(to left, #ffffff00 0.00%, #000000 100.00%)",
  "fade-layer-default-to-tl": "linear-gradient(to top left, #ffffff00 0.00%, #000000 100.00%)",
  "glow-magic-to-t": "linear-gradient(to top, #fef6f7 0.00%, #fef0e7 80.00%, #f9f7f5 100.00%)",
  "glow-magic-to-tr": "linear-gradient(to top right, #fef6f7 0.00%, #fef0e7 80.00%, #f9f7f5 100.00%)",
  "glow-magic-to-r": "linear-gradient(to right, #fef6f7 0.00%, #fef0e7 80.00%, #f9f7f5 100.00%)",
  "glow-magic-to-br": "linear-gradient(to bottom right, #fef6f7 0.00%, #fef0e7 80.00%, #f9f7f5 100.00%)",
  "glow-magic-to-b": "linear-gradient(to bottom, #fef6f7 0.00%, #fef0e7 80.00%, #f9f7f5 100.00%)",
  "glow-magic-to-bl": "linear-gradient(to bottom left, #fef6f7 0.00%, #fef0e7 80.00%, #f9f7f5 100.00%)",
  "glow-magic-to-l": "linear-gradient(to left, #fef6f7 0.00%, #fef0e7 80.00%, #f9f7f5 100.00%)",
  "glow-magic-to-tl": "linear-gradient(to top left, #fef6f7 0.00%, #fef0e7 80.00%, #f9f7f5 100.00%)",
  "shimmer-magic-to-t": "linear-gradient(to top, #fff9f500 0.00%, #fff9f58a 46.00%, #fff9f58a 54.00%, #fff9f500 100.00%)",
  "shimmer-magic-to-tr": "linear-gradient(to top right, #fff9f500 0.00%, #fff9f58a 46.00%, #fff9f58a 54.00%, #fff9f500 100.00%)",
  "shimmer-magic-to-r": "linear-gradient(to right, #fff9f500 0.00%, #fff9f58a 46.00%, #fff9f58a 54.00%, #fff9f500 100.00%)",
  "shimmer-magic-to-br": "linear-gradient(to bottom right, #fff9f500 0.00%, #fff9f58a 46.00%, #fff9f58a 54.00%, #fff9f500 100.00%)",
  "shimmer-magic-to-b": "linear-gradient(to bottom, #fff9f500 0.00%, #fff9f58a 46.00%, #fff9f58a 54.00%, #fff9f500 100.00%)",
  "shimmer-magic-to-bl": "linear-gradient(to bottom left, #fff9f500 0.00%, #fff9f58a 46.00%, #fff9f58a 54.00%, #fff9f500 100.00%)",
  "shimmer-magic-to-l": "linear-gradient(to left, #fff9f500 0.00%, #fff9f58a 46.00%, #fff9f58a 54.00%, #fff9f500 100.00%)",
  "shimmer-magic-to-tl": "linear-gradient(to top left, #fff9f500 0.00%, #fff9f58a 46.00%, #fff9f58a 54.00%, #fff9f500 100.00%)",
  "glow-magic-pressed-to-t": "linear-gradient(to top, #fbf0f2 0.00%, #ffe8db 80.00%, #f5f2ef 100.00%)",
  "glow-magic-pressed-to-tr": "linear-gradient(to top right, #fbf0f2 0.00%, #ffe8db 80.00%, #f5f2ef 100.00%)",
  "glow-magic-pressed-to-r": "linear-gradient(to right, #fbf0f2 0.00%, #ffe8db 80.00%, #f5f2ef 100.00%)",
  "glow-magic-pressed-to-br": "linear-gradient(to bottom right, #fbf0f2 0.00%, #ffe8db 80.00%, #f5f2ef 100.00%)",
  "glow-magic-pressed-to-b": "linear-gradient(to bottom, #fbf0f2 0.00%, #ffe8db 80.00%, #f5f2ef 100.00%)",
  "glow-magic-pressed-to-bl": "linear-gradient(to bottom left, #fbf0f2 0.00%, #ffe8db 80.00%, #f5f2ef 100.00%)",
  "glow-magic-pressed-to-l": "linear-gradient(to left, #fbf0f2 0.00%, #ffe8db 80.00%, #f5f2ef 100.00%)",
  "glow-magic-pressed-to-tl": "linear-gradient(to top left, #fbf0f2 0.00%, #ffe8db 80.00%, #f5f2ef 100.00%)",
  "shimmer-neutral-to-t": "linear-gradient(to top, #ffffff00 0.00%, #ffffff66 46.00%, #ffffff66 54.00%, #ffffff00 100.00%)",
  "shimmer-neutral-to-tr": "linear-gradient(to top right, #ffffff00 0.00%, #ffffff66 46.00%, #ffffff66 54.00%, #ffffff00 100.00%)",
  "shimmer-neutral-to-r": "linear-gradient(to right, #ffffff00 0.00%, #ffffff66 46.00%, #ffffff66 54.00%, #ffffff00 100.00%)",
  "shimmer-neutral-to-br": "linear-gradient(to bottom right, #ffffff00 0.00%, #ffffff66 46.00%, #ffffff66 54.00%, #ffffff00 100.00%)",
  "shimmer-neutral-to-b": "linear-gradient(to bottom, #ffffff00 0.00%, #ffffff66 46.00%, #ffffff66 54.00%, #ffffff00 100.00%)",
  "shimmer-neutral-to-bl": "linear-gradient(to bottom left, #ffffff00 0.00%, #ffffff66 46.00%, #ffffff66 54.00%, #ffffff00 100.00%)",
  "shimmer-neutral-to-l": "linear-gradient(to left, #ffffff00 0.00%, #ffffff66 46.00%, #ffffff66 54.00%, #ffffff00 100.00%)",
  "shimmer-neutral-to-tl": "linear-gradient(to top left, #ffffff00 0.00%, #ffffff66 46.00%, #ffffff66 54.00%, #ffffff00 100.00%)",
  "highlight-magic-to-t": "linear-gradient(to top, #ff6600 20.00%, #d25aca 100.00%)",
  "highlight-magic-to-tr": "linear-gradient(to top right, #ff6600 20.00%, #d25aca 100.00%)",
  "highlight-magic-to-r": "linear-gradient(to right, #ff6600 20.00%, #d25aca 100.00%)",
  "highlight-magic-to-br": "linear-gradient(to bottom right, #ff6600 20.00%, #d25aca 100.00%)",
  "highlight-magic-to-b": "linear-gradient(to bottom, #ff6600 20.00%, #d25aca 100.00%)",
  "highlight-magic-to-bl": "linear-gradient(to bottom left, #ff6600 20.00%, #d25aca 100.00%)",
  "highlight-magic-to-l": "linear-gradient(to left, #ff6600 20.00%, #d25aca 100.00%)",
  "highlight-magic-to-tl": "linear-gradient(to top left, #ff6600 20.00%, #d25aca 100.00%)"
},
        typography: {
  "screen-title": {
    "fontSize": "var(--seed-font-size-t10)",
    "lineHeight": "var(--seed-line-height-t10)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "article-body": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t6)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "t1-regular": {
    "fontSize": "var(--seed-font-size-t1)",
    "lineHeight": "var(--seed-line-height-t1)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "t1-medium": {
    "fontSize": "var(--seed-font-size-t1)",
    "lineHeight": "var(--seed-line-height-t1)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "t1-bold": {
    "fontSize": "var(--seed-font-size-t1)",
    "lineHeight": "var(--seed-line-height-t1)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "t2-regular": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "t2-medium": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "t2-bold": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "t3-regular": {
    "fontSize": "var(--seed-font-size-t3)",
    "lineHeight": "var(--seed-line-height-t3)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "t3-medium": {
    "fontSize": "var(--seed-font-size-t3)",
    "lineHeight": "var(--seed-line-height-t3)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "t3-bold": {
    "fontSize": "var(--seed-font-size-t3)",
    "lineHeight": "var(--seed-line-height-t3)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "t4-regular": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "t4-medium": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "t4-bold": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "t5-regular": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "t5-medium": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "t5-bold": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "t6-regular": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "t6-medium": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "t6-bold": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "t7-regular": {
    "fontSize": "var(--seed-font-size-t7)",
    "lineHeight": "var(--seed-line-height-t7)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "t7-medium": {
    "fontSize": "var(--seed-font-size-t7)",
    "lineHeight": "var(--seed-line-height-t7)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "t7-bold": {
    "fontSize": "var(--seed-font-size-t7)",
    "lineHeight": "var(--seed-line-height-t7)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "t8-bold": {
    "fontSize": "var(--seed-font-size-t8)",
    "lineHeight": "var(--seed-line-height-t8)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "t9-bold": {
    "fontSize": "var(--seed-font-size-t9)",
    "lineHeight": "var(--seed-line-height-t9)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "t10-bold": {
    "fontSize": "var(--seed-font-size-t10)",
    "lineHeight": "var(--seed-line-height-t10)",
    "fontWeight": "var(--seed-font-weight-bold)"
  }
},
        spacing: {
  "x0_5": "var(--seed-dimension-x0_5)",
  "x1": "var(--seed-dimension-x1)",
  "x1_5": "var(--seed-dimension-x1_5)",
  "x2": "var(--seed-dimension-x2)",
  "x2_5": "var(--seed-dimension-x2_5)",
  "x3": "var(--seed-dimension-x3)",
  "x3_5": "var(--seed-dimension-x3_5)",
  "x4": "var(--seed-dimension-x4)",
  "x4_5": "var(--seed-dimension-x4_5)",
  "x5": "var(--seed-dimension-x5)",
  "x6": "var(--seed-dimension-x6)",
  "x7": "var(--seed-dimension-x7)",
  "x8": "var(--seed-dimension-x8)",
  "x9": "var(--seed-dimension-x9)",
  "x10": "var(--seed-dimension-x10)",
  "x12": "var(--seed-dimension-x12)",
  "x13": "var(--seed-dimension-x13)",
  "x14": "var(--seed-dimension-x14)",
  "x16": "var(--seed-dimension-x16)",
  "spacing-x-between-chips": "var(--seed-dimension-spacing-x-between-chips)",
  "spacing-x-global-gutter": "var(--seed-dimension-spacing-x-global-gutter)",
  "spacing-y-component-default": "var(--seed-dimension-spacing-y-component-default)",
  "spacing-y-nav-to-title": "var(--seed-dimension-spacing-y-nav-to-title)",
  "spacing-y-screen-bottom": "var(--seed-dimension-spacing-y-screen-bottom)",
  "spacing-y-between-text": "var(--seed-dimension-spacing-y-between-text)"
},
        borderRadius: {
  "r0_5": "var(--seed-radius-r0_5)",
  "r1": "var(--seed-radius-r1)",
  "r1_5": "var(--seed-radius-r1_5)",
  "r2": "var(--seed-radius-r2)",
  "r2_5": "var(--seed-radius-r2_5)",
  "r3": "var(--seed-radius-r3)",
  "r3_5": "var(--seed-radius-r3_5)",
  "r4": "var(--seed-radius-r4)",
  "r5": "var(--seed-radius-r5)",
  "r6": "var(--seed-radius-r6)",
  "full": "var(--seed-radius-full)"
},
        fontSize: {
  "t1": "var(--seed-font-size-t1)",
  "t2": "var(--seed-font-size-t2)",
  "t3": "var(--seed-font-size-t3)",
  "t4": "var(--seed-font-size-t4)",
  "t5": "var(--seed-font-size-t5)",
  "t6": "var(--seed-font-size-t6)",
  "t7": "var(--seed-font-size-t7)",
  "t8": "var(--seed-font-size-t8)",
  "t9": "var(--seed-font-size-t9)",
  "t10": "var(--seed-font-size-t10)",
  "t2-static": "var(--seed-font-size-t2-static)",
  "t5-static": "var(--seed-font-size-t5-static)",
  "t6-static": "var(--seed-font-size-t6-static)"
},
        lineHeight: {
  "t1": "var(--seed-line-height-t1)",
  "t2": "var(--seed-line-height-t2)",
  "t3": "var(--seed-line-height-t3)",
  "t4": "var(--seed-line-height-t4)",
  "t5": "var(--seed-line-height-t5)",
  "t6": "var(--seed-line-height-t6)",
  "t7": "var(--seed-line-height-t7)",
  "t8": "var(--seed-line-height-t8)",
  "t9": "var(--seed-line-height-t9)",
  "t10": "var(--seed-line-height-t10)"
},
        fontWeight: {
  "regular": "var(--seed-font-weight-regular)",
  "medium": "var(--seed-font-weight-medium)",
  "bold": "var(--seed-font-weight-bold)"
},
        transitionDuration: {
  "d1": "var(--seed-duration-d1)",
  "d2": "var(--seed-duration-d2)",
  "d3": "var(--seed-duration-d3)",
  "d4": "var(--seed-duration-d4)",
  "d5": "var(--seed-duration-d5)",
  "d6": "var(--seed-duration-d6)"
},
        transitionTimingFunction: {
  "linear": "var(--seed-timing-function-linear)",
  "easing": "var(--seed-timing-function-easing)",
  "enter": "var(--seed-timing-function-enter)",
  "exit": "var(--seed-timing-function-exit)",
  "enter-expressive": "var(--seed-timing-function-enter-expressive)",
  "exit-expressive": "var(--seed-timing-function-exit-expressive)"
},
      },
    },
  },
);