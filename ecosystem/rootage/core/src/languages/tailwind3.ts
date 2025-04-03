import type { ComponentSpecDeclaration, TokenDeclaration } from "../parser/ast";

// Tailwind 플러그인 코드 생성 함수
export function getTailwind3PluginCode(
  colorTokens: TokenDeclaration[],
  typographyTokens: ComponentSpecDeclaration[],
): string {
  // 색상 토큰을 저장할 객체 초기화 (플랫하게 모든 색상을 저장)
  const flatColors: Record<string, string> = {};
  // 타이포그래피 토큰을 저장할 객체 초기화
  const flatTypography: Record<string, Record<string, string>> = {};

  // 색상 토큰 처리
  for (const token of colorTokens) {
    // 토큰 그룹이 비어있으면 스킵
    const tokenGroup = token.token.group;
    if (tokenGroup.length === 0) continue;

    // 첫 번째 그룹 요소가 'color'인 경우 제외
    const relevantGroups = tokenGroup[0] === "color" ? tokenGroup.slice(1) : tokenGroup;
    if (relevantGroups.length === 0) continue;

    // 키 생성: 'color' 접두사 제거하고 카테고리-나머지 경로 사용
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

  // 타이포그래피 토큰 처리 (ComponentSpecDeclaration에서 추출)
  // typographyTokens의 variant, state, slot 구조에서 타이포그래피 정보 추출
  for (const typographyToken of typographyTokens) {
    if (typographyToken?.body) {
      // 컴포넌트 스펙의 body에서 variant 순회
      for (const variant of typographyToken.body) {
        // variant 이름 처리 - "textStyle=" 으로 시작하는 variant만 처리
        if (variant.variants.length > 0 && variant.variants.some((v) => v.name === "textStyle")) {
          // textStyle=screenTitle에서 screenTitle 부분만 추출하여 className으로 사용
          const textStyleVariant = variant.variants.find((v) => v.name === "textStyle");
          if (!textStyleVariant) continue;

          const className = textStyleVariant.value;

          // 각 state 순회
          for (const state of variant.body) {
            // state가 enabled인 경우에만 처리
            if (state.states.some((s: { value: string }) => s.value === "enabled")) {
              // 각 slot 순회
              for (const slot of state.body) {
                // slot 이름이 있으면 사용, 없으면 root 사용
                const slotName = slot.slot || "root";

                // slotName이 root인 경우에만 처리 (필요에 따라 조정 가능)
                if (slotName === "root") {
                  // property 순회하여 fontSize, lineHeight, fontWeight 추출
                  const typographyStyle: Record<string, string> = {};

                  for (const prop of slot.body) {
                    if (prop.property === "fontSize" && "value" in prop) {
                      if (prop.kind === "DimensionPropertyDeclaration") {
                        // token 참조인 경우
                        if (prop.value.kind === "TokenLit") {
                          typographyStyle.fontSize = `var(--seed-${prop.value.identifier.replace("$", "").replace(".", "-")})`;
                        }
                        // 직접 값인 경우
                        else if (prop.value.kind === "DimensionLit") {
                          typographyStyle.fontSize = `${prop.value.value}${prop.value.unit}`;
                        }
                      }
                    }

                    if (prop.property === "lineHeight" && "value" in prop) {
                      if (
                        prop.kind === "NumberPropertyDeclaration" ||
                        prop.kind === "DimensionPropertyDeclaration"
                      ) {
                        // token 참조인 경우
                        if (prop.value.kind === "TokenLit") {
                          typographyStyle.lineHeight = `var(--seed-${prop.value.identifier.replace("$", "").replace(".", "-")})`;
                        }
                        // 직접 값인 경우 (NumberLit 또는 DimensionLit)
                        else if ("value" in prop.value) {
                          typographyStyle.lineHeight =
                            prop.value.kind === "DimensionLit"
                              ? `${prop.value.value}${prop.value.unit}`
                              : `${prop.value.value}`;
                        }
                      }
                    }

                    if (prop.property === "fontWeight" && "value" in prop) {
                      if (prop.kind === "NumberPropertyDeclaration") {
                        // token 참조인 경우
                        if (prop.value.kind === "TokenLit") {
                          typographyStyle.fontWeight = `var(--seed-${prop.value.identifier.replace("$", "").replace(".", "-")})`;
                        }
                        // 직접 값인 경우
                        else if (prop.value.kind === "NumberLit") {
                          typographyStyle.fontWeight = `${prop.value.value}`;
                        }
                      }
                    }
                  }

                  // 스타일 정보가 있으면 저장
                  if (Object.keys(typographyStyle).length > 0) {
                    // className(screenTitle 등)을 그대로 사용
                    flatTypography[className] = typographyStyle;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // 직접 문자열 처리를 통해 JSON을 포함시킬 플러그인 코드 생성
  const colorsJson = JSON.stringify(flatColors, null, 2);
  const typographyJson = JSON.stringify(flatTypography, null, 2);

  // Tailwind Plugin 코드 생성
  const pluginCode = `// @ts-nocheck
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
        acc[\`.\${key}\`] = value;
        return acc;
      }, {});
      
      addUtilities(utilities);
    }
  },
  {
    theme: {
      extend: {
        colors: ${colorsJson},
        typography: ${typographyJson}
      }
    }
  }
);`;

  return pluginCode;
}
