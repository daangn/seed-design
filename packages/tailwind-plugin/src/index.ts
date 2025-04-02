// @ts-nocheck
import plugin, { type PluginWithConfig } from "tailwindcss/plugin";

/**
 * Seed Design 색상 토큰을 위한 Tailwind CSS 플러그인
 * 색상 토큰을 클래스 이름으로 사용할 수 있습니다
 * 예: bg-bg-layer-basement, text-fg-brand, border-stroke-divider
 *
 * 모든 색상은 CSS 변수를 사용하여 다크 모드와 자동 호환됩니다.
 */
export const seedDesignPlugin: PluginWithConfig = plugin(
  ({ matchUtilities, theme }) => {
    // 배경색 유틸리티 (bg 카테고리)
    const bgColors = Object.entries(theme("colors"))
      .filter(([key]) => key.startsWith("bg-"))
      .reduce((acc, [key, value]) => {
        acc[key.substring(3)] = value;
        return acc;
      }, {});

    if (Object.keys(bgColors).length > 0) {
      matchUtilities(
        {
          "bg-bg": (value) => ({
            backgroundColor: value,
          }),
        },
        { values: bgColors },
      );
    }

    // 배경색 유틸리티 (palette 카테고리)
    const paletteColors = Object.entries(theme("colors"))
      .filter(([key]) => key.startsWith("palette-"))
      .reduce((acc, [key, value]) => {
        acc[key.substring(8)] = value;
        return acc;
      }, {});

    if (Object.keys(paletteColors).length > 0) {
      matchUtilities(
        {
          "bg-palette": (value) => ({
            backgroundColor: value,
          }),
        },
        { values: paletteColors },
      );
    }

    // 텍스트 색상 유틸리티 (fg 카테고리)
    const fgColors = Object.entries(theme("colors"))
      .filter(([key]) => key.startsWith("fg-"))
      .reduce((acc, [key, value]) => {
        acc[key.substring(3)] = value;
        return acc;
      }, {});

    if (Object.keys(fgColors).length > 0) {
      matchUtilities(
        {
          "text-fg": (value) => ({
            color: value,
          }),
        },
        { values: fgColors },
      );
    }

    // 텍스트 색상 유틸리티 (palette 카테고리)
    if (Object.keys(paletteColors).length > 0) {
      matchUtilities(
        {
          "text-palette": (value) => ({
            color: value,
          }),
        },
        { values: paletteColors },
      );
    }

    // 테두리 색상 유틸리티 (stroke 카테고리)
    const strokeColors = Object.entries(theme("colors"))
      .filter(([key]) => key.startsWith("stroke-"))
      .reduce((acc, [key, value]) => {
        acc[key.substring(7)] = value;
        return acc;
      }, {});

    if (Object.keys(strokeColors).length > 0) {
      matchUtilities(
        {
          "border-stroke": (value) => ({
            borderColor: value,
          }),
        },
        { values: strokeColors },
      );
    }

    // 테두리 색상 유틸리티 (palette 카테고리)
    if (Object.keys(paletteColors).length > 0) {
      matchUtilities(
        {
          "border-palette": (value) => ({
            borderColor: value,
          }),
        },
        { values: paletteColors },
      );
    }
  },
  {
    theme: {
      extend: {
        colors: {
          ...{
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
            "palette-static-black-alpha-50":
              "var(--seed-color-color-palette-static-black-alpha-50)",
            "palette-static-black-alpha-200":
              "var(--seed-color-color-palette-static-black-alpha-200)",
            "palette-static-black-alpha-500":
              "var(--seed-color-color-palette-static-black-alpha-500)",
            "palette-static-white-alpha-200":
              "var(--seed-color-color-palette-static-white-alpha-200)",
            "palette-static-white-alpha-800":
              "var(--seed-color-color-palette-static-white-alpha-800)",
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
            "bg-neutral-solid-muted-pressed":
              "var(--seed-color-color-bg-neutral-solid-muted-pressed)",
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
            "gradient-shimmer": "var(--seed-color-gradient-shimmer)",
          },
        },
      },
    },
  },
);
