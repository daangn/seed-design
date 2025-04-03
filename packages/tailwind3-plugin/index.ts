// @ts-nocheck
import plugin, { type PluginWithConfig } from "tailwindcss/plugin";

/**
 * Seed Design 디자인 토큰을 위한 Tailwind CSS 플러그인
 * 색상 토큰과 타이포그래피 토큰을 클래스 이름으로 사용할 수 있습니다
 * 예시: 
 * - 색상: bg-bg-layer-basement, text-fg-brand, border-stroke-divider
 * - 타이포그래피: t1Regular, t1Medium, t1Bold, screenTitle, articleBody
 * 
 * 모든 토큰은 CSS 변수를 사용하여 다크 모드와 자동 호환됩니다.
 */
export const seedDesignPlugin: PluginWithConfig = plugin(
  ({ matchUtilities, theme, addUtilities }) => {
    // 배경색 유틸리티 (bg 카테고리)
    const bgColors = Object.entries(theme('colors'))
      .filter(([key]) => key.startsWith('bg-'))
      .reduce((acc, [key, value]) => {
        acc[key.substring(3)] = value;
        return acc;
      }, {});
    
    if (Object.keys(bgColors).length > 0) {
      matchUtilities(
        {
          'bg-bg': (value) => ({
            backgroundColor: value,
          }),
        },
        { values: bgColors }
      );
    }

    // 배경색 유틸리티 (palette 카테고리)
    const paletteColors = Object.entries(theme('colors'))
      .filter(([key]) => key.startsWith('palette-'))
      .reduce((acc, [key, value]) => {
        acc[key.substring(8)] = value;
        return acc;
      }, {});
    
    if (Object.keys(paletteColors).length > 0) {
      matchUtilities(
        {
          'bg-palette': (value) => ({
            backgroundColor: value,
          }),
        },
        { values: paletteColors }
      );
    }

    // 텍스트 색상 유틸리티 (fg 카테고리)
    const fgColors = Object.entries(theme('colors'))
      .filter(([key]) => key.startsWith('fg-'))
      .reduce((acc, [key, value]) => {
        acc[key.substring(3)] = value;
        return acc;
      }, {});
    
    if (Object.keys(fgColors).length > 0) {
      matchUtilities(
        {
          'text-fg': (value) => ({
            color: value,
          }),
        },
        { values: fgColors }
      );
    }

    // 텍스트 색상 유틸리티 (palette 카테고리)
    if (Object.keys(paletteColors).length > 0) {
      matchUtilities(
        {
          'text-palette': (value) => ({
            color: value,
          }),
        },
        { values: paletteColors }
      );
    }

    // 테두리 색상 유틸리티 (stroke 카테고리)
    const strokeColors = Object.entries(theme('colors'))
      .filter(([key]) => key.startsWith('stroke-'))
      .reduce((acc, [key, value]) => {
        acc[key.substring(7)] = value;
        return acc;
      }, {});
    
    if (Object.keys(strokeColors).length > 0) {
      matchUtilities(
        {
          'border-stroke': (value) => ({
            borderColor: value,
          }),
        },
        { values: strokeColors }
      );
    }

    // 테두리 색상 유틸리티 (palette 카테고리)
    if (Object.keys(paletteColors).length > 0) {
      matchUtilities(
        {
          'border-palette': (value) => ({
            borderColor: value,
          }),
        },
        { values: paletteColors }
      );
    }

    // 타이포그래피 유틸리티 추가
    const typographyStyles = theme('typography');
    if (typographyStyles) {
      const utilities = Object.entries(typographyStyles).reduce((acc, [key, value]) => {
        acc[`.${key}`] = value;
        return acc;
      }, {});
      
      addUtilities(utilities);
    }
  },
  {
    theme: {
      extend: {
        colors: {
  "palette-blue-100": "var(--seed-color-color-palette-blue-100)",
  "palette-blue-200": "var(--seed-color-color-palette-blue-200)",
  "palette-blue-300": "var(--seed-color-color-palette-blue-300)",
  "palette-blue-400": "var(--seed-color-color-palette-blue-400)",
  "palette-blue-500": "var(--seed-color-color-palette-blue-500)",
  "palette-blue-600": "var(--seed-color-color-palette-blue-600)",
  "palette-blue-700": "var(--seed-color-color-palette-blue-700)",
  "palette-blue-800": "var(--seed-color-color-palette-blue-800)",
  "palette-blue-900": "var(--seed-color-color-palette-blue-900)",
  "palette-blue-1000": "var(--seed-color-color-palette-blue-1000)",
  "palette-carrot-100": "var(--seed-color-color-palette-carrot-100)",
  "palette-carrot-200": "var(--seed-color-color-palette-carrot-200)",
  "palette-carrot-300": "var(--seed-color-color-palette-carrot-300)",
  "palette-carrot-400": "var(--seed-color-color-palette-carrot-400)",
  "palette-carrot-500": "var(--seed-color-color-palette-carrot-500)",
  "palette-carrot-600": "var(--seed-color-color-palette-carrot-600)",
  "palette-carrot-700": "var(--seed-color-color-palette-carrot-700)",
  "palette-carrot-800": "var(--seed-color-color-palette-carrot-800)",
  "palette-carrot-900": "var(--seed-color-color-palette-carrot-900)",
  "palette-carrot-1000": "var(--seed-color-color-palette-carrot-1000)",
  "palette-gray-00": "var(--seed-color-color-palette-gray-00)",
  "palette-gray-100": "var(--seed-color-color-palette-gray-100)",
  "palette-gray-200": "var(--seed-color-color-palette-gray-200)",
  "palette-gray-300": "var(--seed-color-color-palette-gray-300)",
  "palette-gray-400": "var(--seed-color-color-palette-gray-400)",
  "palette-gray-500": "var(--seed-color-color-palette-gray-500)",
  "palette-gray-600": "var(--seed-color-color-palette-gray-600)",
  "palette-gray-700": "var(--seed-color-color-palette-gray-700)",
  "palette-gray-800": "var(--seed-color-color-palette-gray-800)",
  "palette-gray-900": "var(--seed-color-color-palette-gray-900)",
  "palette-gray-1000": "var(--seed-color-color-palette-gray-1000)",
  "palette-green-100": "var(--seed-color-color-palette-green-100)",
  "palette-green-200": "var(--seed-color-color-palette-green-200)",
  "palette-green-300": "var(--seed-color-color-palette-green-300)",
  "palette-green-400": "var(--seed-color-color-palette-green-400)",
  "palette-green-500": "var(--seed-color-color-palette-green-500)",
  "palette-green-600": "var(--seed-color-color-palette-green-600)",
  "palette-green-700": "var(--seed-color-color-palette-green-700)",
  "palette-green-800": "var(--seed-color-color-palette-green-800)",
  "palette-green-900": "var(--seed-color-color-palette-green-900)",
  "palette-green-1000": "var(--seed-color-color-palette-green-1000)",
  "palette-purple-100": "var(--seed-color-color-palette-purple-100)",
  "palette-purple-200": "var(--seed-color-color-palette-purple-200)",
  "palette-purple-300": "var(--seed-color-color-palette-purple-300)",
  "palette-purple-400": "var(--seed-color-color-palette-purple-400)",
  "palette-purple-500": "var(--seed-color-color-palette-purple-500)",
  "palette-purple-600": "var(--seed-color-color-palette-purple-600)",
  "palette-purple-700": "var(--seed-color-color-palette-purple-700)",
  "palette-purple-800": "var(--seed-color-color-palette-purple-800)",
  "palette-purple-900": "var(--seed-color-color-palette-purple-900)",
  "palette-purple-1000": "var(--seed-color-color-palette-purple-1000)",
  "palette-red-100": "var(--seed-color-color-palette-red-100)",
  "palette-red-200": "var(--seed-color-color-palette-red-200)",
  "palette-red-300": "var(--seed-color-color-palette-red-300)",
  "palette-red-400": "var(--seed-color-color-palette-red-400)",
  "palette-red-500": "var(--seed-color-color-palette-red-500)",
  "palette-red-600": "var(--seed-color-color-palette-red-600)",
  "palette-red-700": "var(--seed-color-color-palette-red-700)",
  "palette-red-800": "var(--seed-color-color-palette-red-800)",
  "palette-red-900": "var(--seed-color-color-palette-red-900)",
  "palette-red-1000": "var(--seed-color-color-palette-red-1000)",
  "palette-static-black": "var(--seed-color-color-palette-static-black)",
  "palette-static-white": "var(--seed-color-color-palette-static-white)",
  "palette-static-black-alpha-50": "var(--seed-color-color-palette-static-black-alpha-50)",
  "palette-static-black-alpha-200": "var(--seed-color-color-palette-static-black-alpha-200)",
  "palette-static-black-alpha-500": "var(--seed-color-color-palette-static-black-alpha-500)",
  "palette-static-white-alpha-200": "var(--seed-color-color-palette-static-white-alpha-200)",
  "palette-static-white-alpha-800": "var(--seed-color-color-palette-static-white-alpha-800)",
  "palette-yellow-100": "var(--seed-color-color-palette-yellow-100)",
  "palette-yellow-200": "var(--seed-color-color-palette-yellow-200)",
  "palette-yellow-300": "var(--seed-color-color-palette-yellow-300)",
  "palette-yellow-400": "var(--seed-color-color-palette-yellow-400)",
  "palette-yellow-500": "var(--seed-color-color-palette-yellow-500)",
  "palette-yellow-600": "var(--seed-color-color-palette-yellow-600)",
  "palette-yellow-700": "var(--seed-color-color-palette-yellow-700)",
  "palette-yellow-800": "var(--seed-color-color-palette-yellow-800)",
  "palette-yellow-900": "var(--seed-color-color-palette-yellow-900)",
  "palette-yellow-1000": "var(--seed-color-color-palette-yellow-1000)",
  "fg-brand": "var(--seed-color-color-fg-brand)",
  "fg-critical": "var(--seed-color-color-fg-critical)",
  "fg-disabled": "var(--seed-color-color-fg-disabled)",
  "fg-informative": "var(--seed-color-color-fg-informative)",
  "fg-magic": "var(--seed-color-color-fg-magic)",
  "fg-neutral": "var(--seed-color-color-fg-neutral)",
  "fg-placeholder": "var(--seed-color-color-fg-placeholder)",
  "fg-positive": "var(--seed-color-color-fg-positive)",
  "fg-critical-contrast": "var(--seed-color-color-fg-critical-contrast)",
  "fg-informative-contrast": "var(--seed-color-color-fg-informative-contrast)",
  "fg-magic-contrast": "var(--seed-color-color-fg-magic-contrast)",
  "fg-neutral-inverted": "var(--seed-color-color-fg-neutral-inverted)",
  "fg-neutral-muted": "var(--seed-color-color-fg-neutral-muted)",
  "fg-neutral-subtle": "var(--seed-color-color-fg-neutral-subtle)",
  "fg-positive-contrast": "var(--seed-color-color-fg-positive-contrast)",
  "fg-warning-contrast": "var(--seed-color-color-fg-warning-contrast)",
  "bg-disabled": "var(--seed-color-color-bg-disabled)",
  "bg-overlay": "var(--seed-color-color-bg-overlay)",
  "bg-brand-solid": "var(--seed-color-color-bg-brand-solid)",
  "bg-brand-solid-pressed": "var(--seed-color-color-bg-brand-solid-pressed)",
  "bg-critical-solid": "var(--seed-color-color-bg-critical-solid)",
  "bg-critical-weak": "var(--seed-color-color-bg-critical-weak)",
  "bg-critical-solid-pressed": "var(--seed-color-color-bg-critical-solid-pressed)",
  "bg-critical-weak-pressed": "var(--seed-color-color-bg-critical-weak-pressed)",
  "bg-informative-solid": "var(--seed-color-color-bg-informative-solid)",
  "bg-informative-weak": "var(--seed-color-color-bg-informative-weak)",
  "bg-informative-solid-pressed": "var(--seed-color-color-bg-informative-solid-pressed)",
  "bg-informative-weak-pressed": "var(--seed-color-color-bg-informative-weak-pressed)",
  "bg-layer-basement": "var(--seed-color-color-bg-layer-basement)",
  "bg-layer-default": "var(--seed-color-color-bg-layer-default)",
  "bg-layer-fill": "var(--seed-color-color-bg-layer-fill)",
  "bg-layer-floating": "var(--seed-color-color-bg-layer-floating)",
  "bg-layer-default-pressed": "var(--seed-color-color-bg-layer-default-pressed)",
  "bg-layer-floating-pressed": "var(--seed-color-color-bg-layer-floating-pressed)",
  "bg-magic-solid": "var(--seed-color-color-bg-magic-solid)",
  "bg-magic-weak": "var(--seed-color-color-bg-magic-weak)",
  "bg-magic-solid-pressed": "var(--seed-color-color-bg-magic-solid-pressed)",
  "bg-magic-weak-pressed": "var(--seed-color-color-bg-magic-weak-pressed)",
  "bg-neutral-inverted": "var(--seed-color-color-bg-neutral-inverted)",
  "bg-neutral-solid": "var(--seed-color-color-bg-neutral-solid)",
  "bg-neutral-weak": "var(--seed-color-color-bg-neutral-weak)",
  "bg-neutral-inverted-pressed": "var(--seed-color-color-bg-neutral-inverted-pressed)",
  "bg-neutral-solid-muted": "var(--seed-color-color-bg-neutral-solid-muted)",
  "bg-neutral-solid-muted-pressed": "var(--seed-color-color-bg-neutral-solid-muted-pressed)",
  "bg-neutral-weak-pressed": "var(--seed-color-color-bg-neutral-weak-pressed)",
  "bg-overlay-muted": "var(--seed-color-color-bg-overlay-muted)",
  "bg-positive-solid": "var(--seed-color-color-bg-positive-solid)",
  "bg-positive-weak": "var(--seed-color-color-bg-positive-weak)",
  "bg-positive-solid-pressed": "var(--seed-color-color-bg-positive-solid-pressed)",
  "bg-positive-weak-pressed": "var(--seed-color-color-bg-positive-weak-pressed)",
  "bg-warning-solid": "var(--seed-color-color-bg-warning-solid)",
  "bg-warning-weak": "var(--seed-color-color-bg-warning-weak)",
  "bg-warning-weak-pressed": "var(--seed-color-color-bg-warning-weak-pressed)",
  "stroke-brand": "var(--seed-color-color-stroke-brand)",
  "stroke-control": "var(--seed-color-color-stroke-control)",
  "stroke-critical": "var(--seed-color-color-stroke-critical)",
  "stroke-field": "var(--seed-color-color-stroke-field)",
  "stroke-informative": "var(--seed-color-color-stroke-informative)",
  "stroke-neutral": "var(--seed-color-color-stroke-neutral)",
  "stroke-positive": "var(--seed-color-color-stroke-positive)",
  "stroke-field-focused": "var(--seed-color-color-stroke-field-focused)",
  "stroke-neutral-muted": "var(--seed-color-color-stroke-neutral-muted)",
  "stroke-on-image": "var(--seed-color-color-stroke-on-image)",
  "manner-temp-l1-bg": "var(--seed-color-color-manner-temp-l1-bg)",
  "manner-temp-l1-text": "var(--seed-color-color-manner-temp-l1-text)",
  "manner-temp-l2-bg": "var(--seed-color-color-manner-temp-l2-bg)",
  "manner-temp-l2-text": "var(--seed-color-color-manner-temp-l2-text)",
  "manner-temp-l3-bg": "var(--seed-color-color-manner-temp-l3-bg)",
  "manner-temp-l3-text": "var(--seed-color-color-manner-temp-l3-text)",
  "manner-temp-l4-bg": "var(--seed-color-color-manner-temp-l4-bg)",
  "manner-temp-l4-text": "var(--seed-color-color-manner-temp-l4-text)",
  "manner-temp-l5-bg": "var(--seed-color-color-manner-temp-l5-bg)",
  "manner-temp-l5-text": "var(--seed-color-color-manner-temp-l5-text)",
  "manner-temp-l6-bg": "var(--seed-color-color-manner-temp-l6-bg)",
  "manner-temp-l6-text": "var(--seed-color-color-manner-temp-l6-text)",
  "dimension-x0_5": "var(--seed-color-dimension-x0_5)",
  "dimension-x1": "var(--seed-color-dimension-x1)",
  "dimension-x1_5": "var(--seed-color-dimension-x1_5)",
  "dimension-x2": "var(--seed-color-dimension-x2)",
  "dimension-x2_5": "var(--seed-color-dimension-x2_5)",
  "dimension-x3": "var(--seed-color-dimension-x3)",
  "dimension-x3_5": "var(--seed-color-dimension-x3_5)",
  "dimension-x4": "var(--seed-color-dimension-x4)",
  "dimension-x4_5": "var(--seed-color-dimension-x4_5)",
  "dimension-x5": "var(--seed-color-dimension-x5)",
  "dimension-x6": "var(--seed-color-dimension-x6)",
  "dimension-x7": "var(--seed-color-dimension-x7)",
  "dimension-x8": "var(--seed-color-dimension-x8)",
  "dimension-x9": "var(--seed-color-dimension-x9)",
  "dimension-x10": "var(--seed-color-dimension-x10)",
  "dimension-x12": "var(--seed-color-dimension-x12)",
  "dimension-x13": "var(--seed-color-dimension-x13)",
  "dimension-x14": "var(--seed-color-dimension-x14)",
  "dimension-x16": "var(--seed-color-dimension-x16)",
  "dimension-spacing-x-between-chips": "var(--seed-color-dimension-spacing-x-between-chips)",
  "dimension-spacing-x-global-gutter": "var(--seed-color-dimension-spacing-x-global-gutter)",
  "dimension-spacing-y-component-default": "var(--seed-color-dimension-spacing-y-component-default)",
  "dimension-spacing-y-nav-to-title": "var(--seed-color-dimension-spacing-y-nav-to-title)",
  "dimension-spacing-y-screen-bottom": "var(--seed-color-dimension-spacing-y-screen-bottom)",
  "dimension-spacing-y-between-text": "var(--seed-color-dimension-spacing-y-between-text)",
  "duration-d1": "var(--seed-color-duration-d1)",
  "duration-d2": "var(--seed-color-duration-d2)",
  "duration-d3": "var(--seed-color-duration-d3)",
  "duration-d4": "var(--seed-color-duration-d4)",
  "duration-d5": "var(--seed-color-duration-d5)",
  "duration-d6": "var(--seed-color-duration-d6)",
  "font-size-t1": "var(--seed-color-font-size-t1)",
  "font-size-t2": "var(--seed-color-font-size-t2)",
  "font-size-t3": "var(--seed-color-font-size-t3)",
  "font-size-t4": "var(--seed-color-font-size-t4)",
  "font-size-t5": "var(--seed-color-font-size-t5)",
  "font-size-t6": "var(--seed-color-font-size-t6)",
  "font-size-t7": "var(--seed-color-font-size-t7)",
  "font-size-t8": "var(--seed-color-font-size-t8)",
  "font-size-t9": "var(--seed-color-font-size-t9)",
  "font-size-t10": "var(--seed-color-font-size-t10)",
  "font-size-t2-static": "var(--seed-color-font-size-t2-static)",
  "font-size-t5-static": "var(--seed-color-font-size-t5-static)",
  "font-size-t6-static": "var(--seed-color-font-size-t6-static)",
  "font-weight-regular": "var(--seed-color-font-weight-regular)",
  "font-weight-medium": "var(--seed-color-font-weight-medium)",
  "font-weight-bold": "var(--seed-color-font-weight-bold)",
  "gradient-shimmer": "var(--seed-color-gradient-shimmer)",
  "line-height-t1": "var(--seed-color-line-height-t1)",
  "line-height-t2": "var(--seed-color-line-height-t2)",
  "line-height-t3": "var(--seed-color-line-height-t3)",
  "line-height-t4": "var(--seed-color-line-height-t4)",
  "line-height-t5": "var(--seed-color-line-height-t5)",
  "line-height-t6": "var(--seed-color-line-height-t6)",
  "line-height-t7": "var(--seed-color-line-height-t7)",
  "line-height-t8": "var(--seed-color-line-height-t8)",
  "line-height-t9": "var(--seed-color-line-height-t9)",
  "line-height-t10": "var(--seed-color-line-height-t10)",
  "radius-r0_5": "var(--seed-color-radius-r0_5)",
  "radius-r1": "var(--seed-color-radius-r1)",
  "radius-r1_5": "var(--seed-color-radius-r1_5)",
  "radius-r2": "var(--seed-color-radius-r2)",
  "radius-r2_5": "var(--seed-color-radius-r2_5)",
  "radius-r3": "var(--seed-color-radius-r3)",
  "radius-r3_5": "var(--seed-color-radius-r3_5)",
  "radius-r4": "var(--seed-color-radius-r4)",
  "radius-r5": "var(--seed-color-radius-r5)",
  "radius-r6": "var(--seed-color-radius-r6)",
  "radius-full": "var(--seed-color-radius-full)",
  "timing-function-linear": "var(--seed-color-timing-function-linear)",
  "timing-function-easing": "var(--seed-color-timing-function-easing)",
  "timing-function-enter": "var(--seed-color-timing-function-enter)",
  "timing-function-exit": "var(--seed-color-timing-function-exit)",
  "timing-function-enter-expressive": "var(--seed-color-timing-function-enter-expressive)",
  "timing-function-exit-expressive": "var(--seed-color-timing-function-exit-expressive)"
},
        typography: {
  "base-label": {
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "sizexsmalllayoutwithText-label": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizesmalllayoutwithText-label": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizemediumlayoutwithText-label": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizelargelayoutwithText-label": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)"
  },
  "base-count": {
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "sizesmall-label": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizesmall-count": {
    "fontSize": "var(--seed-font-size-t3)",
    "lineHeight": "var(--seed-line-height-t3)"
  },
  "sizemedium-label": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizemedium-count": {
    "fontSize": "var(--seed-font-size-t4)"
  },
  "base-title": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "base-description": {
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "sizelarge-label": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)"
  },
  "variantweak-label": {
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "variantsolid-label": {
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "variantoutline-label": {
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "base-link": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "weightdefault-label": {
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "weightstronger-label": {
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "variantneutralSolid-label": {
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "variantbrandSolid-label": {
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "weightregular-label": {
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "weightbold-label": {
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "sizet4-label": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizet5-label": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)"
  },
  "sizet6-label": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)"
  },
  "sizexsmall-label": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizexsmall-count": {
    "fontSize": "var(--seed-font-size-t3)",
    "lineHeight": "var(--seed-line-height-t3)"
  },
  "base-message": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "base-actionButton": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "base-indicator": {
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "base-errorMessage": {
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "base-characterCount": {
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "base-maxCharacterCount": {
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "sizexlarge-label": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)"
  },
  "sizexlarge-indicator": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)"
  },
  "sizexlarge-value": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)"
  },
  "sizexlarge-prefixText": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)"
  },
  "sizexlarge-suffixText": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)"
  },
  "sizexlarge-description": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizexlarge-errorMessage": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizexlarge-characterCount": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)"
  },
  "sizexlarge-maxCharacterCount": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)"
  },
  "sizelarge-indicator": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)"
  },
  "sizelarge-value": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)"
  },
  "sizelarge-prefixText": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)"
  },
  "sizelarge-suffixText": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)"
  },
  "sizelarge-description": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizelarge-errorMessage": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizelarge-characterCount": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)"
  },
  "sizelarge-maxCharacterCount": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)"
  },
  "sizemedium-indicator": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizemedium-value": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizemedium-prefixText": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizemedium-suffixText": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)"
  },
  "sizemedium-description": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)"
  },
  "sizemedium-errorMessage": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)"
  },
  "sizemedium-characterCount": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)"
  },
  "sizemedium-maxCharacterCount": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)"
  },
  "titleLayouttitleOnly-title": {
    "fontSize": "var(--seed-font-size-t6-static)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "titleLayoutwithSubtitle-title": {
    "fontSize": "var(--seed-font-size-t5-static)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "titleLayoutwithSubtitle-subtitle": {
    "fontSize": "var(--seed-font-size-t2-static)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "textStylescreenTitle": {
    "fontSize": "var(--seed-font-size-t10)",
    "lineHeight": "var(--seed-line-height-t10)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "textStylearticleBody": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t6)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "textStylet1Regular": {
    "fontSize": "var(--seed-font-size-t1)",
    "lineHeight": "var(--seed-line-height-t1)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "textStylet1Medium": {
    "fontSize": "var(--seed-font-size-t1)",
    "lineHeight": "var(--seed-line-height-t1)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "textStylet1Bold": {
    "fontSize": "var(--seed-font-size-t1)",
    "lineHeight": "var(--seed-line-height-t1)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "textStylet2Regular": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "textStylet2Medium": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "textStylet2Bold": {
    "fontSize": "var(--seed-font-size-t2)",
    "lineHeight": "var(--seed-line-height-t2)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "textStylet3Regular": {
    "fontSize": "var(--seed-font-size-t3)",
    "lineHeight": "var(--seed-line-height-t3)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "textStylet3Medium": {
    "fontSize": "var(--seed-font-size-t3)",
    "lineHeight": "var(--seed-line-height-t3)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "textStylet3Bold": {
    "fontSize": "var(--seed-font-size-t3)",
    "lineHeight": "var(--seed-line-height-t3)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "textStylet4Regular": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "textStylet4Medium": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "textStylet4Bold": {
    "fontSize": "var(--seed-font-size-t4)",
    "lineHeight": "var(--seed-line-height-t4)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "textStylet5Regular": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "textStylet5Medium": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "textStylet5Bold": {
    "fontSize": "var(--seed-font-size-t5)",
    "lineHeight": "var(--seed-line-height-t5)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "textStylet6Regular": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "textStylet6Medium": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "textStylet6Bold": {
    "fontSize": "var(--seed-font-size-t6)",
    "lineHeight": "var(--seed-line-height-t6)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "textStylet7Regular": {
    "fontSize": "var(--seed-font-size-t7)",
    "lineHeight": "var(--seed-line-height-t7)",
    "fontWeight": "var(--seed-font-weight-regular)"
  },
  "textStylet7Medium": {
    "fontSize": "var(--seed-font-size-t7)",
    "lineHeight": "var(--seed-line-height-t7)",
    "fontWeight": "var(--seed-font-weight-medium)"
  },
  "textStylet7Bold": {
    "fontSize": "var(--seed-font-size-t7)",
    "lineHeight": "var(--seed-line-height-t7)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "textStylet8Bold": {
    "fontSize": "var(--seed-font-size-t8)",
    "lineHeight": "var(--seed-line-height-t8)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "textStylet9Bold": {
    "fontSize": "var(--seed-font-size-t9)",
    "lineHeight": "var(--seed-line-height-t9)",
    "fontWeight": "var(--seed-font-weight-bold)"
  },
  "textStylet10Bold": {
    "fontSize": "var(--seed-font-size-t10)",
    "lineHeight": "var(--seed-line-height-t10)",
    "fontWeight": "var(--seed-font-weight-bold)"
  }
}
      }
    }
  }
);