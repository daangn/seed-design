import type { TokenDeclaration } from "../parser/ast";

// Tailwind 플러그인 코드 생성 함수
export function getTailwindPluginCode(tokens: TokenDeclaration[]): string {
  // 색상 토큰을 저장할 객체 초기화 (플랫하게 모든 색상을 저장)
  const flatColors: Record<string, string> = {};

  // 색상 컬렉션에서 토큰 필터링
  const colorTokensAll = tokens.filter((token) => token.collection === "color");

  // 모든 토큰 처리
  for (const token of colorTokensAll) {
    // 토큰 그룹이 비어있으면 스킵
    const tokenGroup = token.token.group;
    if (tokenGroup.length === 0) continue;

    // 첫 번째 그룹 요소가 'color'인 경우 제외
    const relevantGroups = tokenGroup[0] === "color" ? tokenGroup.slice(1) : tokenGroup;
    if (relevantGroups.length === 0) continue;

    // 키 생성: 'color' 접두사 제거하고 카테고리-나머지 경로 사용
    // 예: $color.palette.blue-100 -> palette-blue-100
    // 예: $color.bg.layer-basement -> bg-layer-basement
    const tokenKey =
      relevantGroups.join("-") +
      (token.token.key ? `-${token.token.key.replaceAll(".", "-")}` : "");

    // CSS 변수 이름 생성
    const cssVarName = `--seed-color-${token.token.group.join("-")}${
      token.token.group.length > 0 && token.token.key ? "-" : ""
    }${token.token.key}`;

    // CSS 변수로 토큰 저장
    flatColors[tokenKey] = `var(${cssVarName})`;
  }

  // Tailwind Plugin 코드 생성
  const pluginCode = `// @ts-nocheck
import plugin, { type PluginWithConfig } from "tailwindcss/plugin";

/**
 * Seed Design 색상 토큰을 위한 Tailwind CSS 플러그인
 * 색상 토큰을 클래스 이름으로 사용할 수 있습니다
 * 예: bg-bg-layer-basement, text-fg-brand, border-stroke-divider
 * 
 * 모든 색상은 CSS 변수를 사용하여 다크 모드와 자동 호환됩니다.
 */
const seedDesignPlugin: PluginWithConfig = plugin(
  ({ matchUtilities, theme }) => {
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
  },
  {
    theme: {
      extend: {
        colors: ${JSON.stringify(flatColors, null, 2)}
      },
    },
  }
);

export default seedDesignPlugin;`;

  return pluginCode;
}
