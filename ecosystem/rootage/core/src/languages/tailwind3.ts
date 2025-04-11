import type { ComponentSpecDeclaration, TokenDeclaration } from "../parser/ast";
import { convertToKebabCase } from "../utils/string";

// Tailwind 플러그인 코드 생성 함수
export function getTailwind3PluginCode(
  foundationTokens: TokenDeclaration[],
  typographyTokens: ComponentSpecDeclaration[],
): string {
  // 각 카테고리별 토큰을 저장할 객체 초기화
  const colorTokens: Record<string, string> = {};
  const dimensionTokens: Record<string, string> = {};
  const radiusTokens: Record<string, string> = {};
  const fontSizeTokens: Record<string, string> = {};
  const lineHeightTokens: Record<string, string> = {};
  const fontWeightTokens: Record<string, string> = {};
  const durationTokens: Record<string, string> = {};
  const timingFunctionTokens: Record<string, string> = {};

  // 타이포그래피 토큰을 저장할 객체 초기화
  const flatTypography: Record<string, Record<string, string>> = {};

  // 토큰 처리
  for (const token of foundationTokens) {
    // 토큰 그룹이 비어있으면 스킵
    const tokenGroup = token.token.group;
    if (tokenGroup.length === 0) continue;

    // 키 생성: 카테고리-나머지 경로 사용
    const tokenKey =
      tokenGroup.join("-") + (token.token.key ? `-${token.token.key.replaceAll(".", "-")}` : "");

    // CSS 변수 이름 생성
    const cssVarName = `--seed-${token.token.group.join("-")}${
      token.token.group.length > 0 && token.token.key ? "-" : ""
    }${token.token.key}`;

    // CSS 변수 값
    const cssVarValue = `var(${cssVarName})`;

    // 토큰 타입에 따라 적절한 객체에 저장
    if (tokenGroup[0] === "color") {
      // 색상 토큰의 경우
      // 첫 번째 그룹 요소 'color' 제외하고 카테고리-나머지 경로 사용
      const relevantGroups = tokenGroup.slice(1);
      if (relevantGroups.length === 0) continue;

      const colorKey =
        relevantGroups.join("-") +
        (token.token.key ? `-${token.token.key.replaceAll(".", "-")}` : "");

      colorTokens[colorKey] = cssVarValue;
    } else if (tokenKey.startsWith("dimension-")) {
      dimensionTokens[tokenKey.substring(10)] = cssVarValue;
    } else if (tokenKey.startsWith("radius-")) {
      radiusTokens[tokenKey.substring(7)] = cssVarValue;
    } else if (tokenKey.startsWith("font-size-")) {
      fontSizeTokens[tokenKey.substring(10)] = cssVarValue;
    } else if (tokenKey.startsWith("line-height-")) {
      lineHeightTokens[tokenKey.substring(12)] = cssVarValue;
    } else if (tokenKey.startsWith("font-weight-")) {
      fontWeightTokens[tokenKey.substring(12)] = cssVarValue;
    } else if (tokenKey.startsWith("duration-")) {
      durationTokens[tokenKey.substring(9)] = cssVarValue;
    } else if (tokenKey.startsWith("timing-function-")) {
      timingFunctionTokens[tokenKey.substring(16)] = cssVarValue;
    } else if (tokenKey.startsWith("gradient-shimmer-")) {
      // 그라데이션 쉐이머 토큰의 경우
      colorTokens[tokenKey.substring(16)] = cssVarValue;
    }
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
          // 캐멀케이스를 케밥케이스로 변환
          const kebabClassName = convertToKebabCase(className);

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
                          typographyStyle.fontSize = `var(--seed-${prop.value.identifier.replace(/\$/g, "").replace(/\./g, "-")})`;
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
                          typographyStyle.fontWeight = `var(--seed-${prop.value.identifier.replace(/\$/g, "").replace(/\./g, "-")})`;
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
                    // kebabClassName 사용 (camelCase를 kebab-case로 변환)
                    flatTypography[kebabClassName] = typographyStyle;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // JSON 직렬화
  const colorsJson = JSON.stringify(colorTokens, null, 2);
  const typographyJson = JSON.stringify(flatTypography, null, 2);
  const dimensionsJson = JSON.stringify(dimensionTokens, null, 2);
  const borderRadiusJson = JSON.stringify(radiusTokens, null, 2);
  const fontSizeJson = JSON.stringify(fontSizeTokens, null, 2);
  const lineHeightJson = JSON.stringify(lineHeightTokens, null, 2);
  const fontWeightJson = JSON.stringify(fontWeightTokens, null, 2);
  const durationJson = JSON.stringify(durationTokens, null, 2);
  const timingFunctionJson = JSON.stringify(timingFunctionTokens, null, 2);

  // Tailwind Plugin 코드 생성
  const pluginCode = `// @ts-nocheck
import plugin from "tailwindcss/plugin";

/**
 * Seed Design 디자인 토큰을 위한 Tailwind CSS 플러그인
 * 색상 토큰과 타이포그래피 토큰을 클래스 이름으로 사용할 수 있습니다
 * 예시: 
 * - 색상: bg-bg-layer-basement, text-fg-brand, border-stroke-divider
 * - 타이포그래피: t1-regular, t1-bold, screen-title
 * 
 * 모든 토큰은 CSS 변수를 사용하여 다크 모드와 자동 호환됩니다.
 */
export default plugin(
  ({ theme, addComponents }) => {  
  // typography 유틸리티
   const typography = theme("typography");
   if (typography) {
     // matchUtilities 대신 addComponents 사용
     addComponents(
       Object.entries(typography).reduce((acc, [key, value]) => {
         acc[\`.\${key}\`] = value;
         return acc;
       }, {})
     );
   }
    
  },
  {
    theme: {
      extend: {
        colors: ${colorsJson},
        typography: ${typographyJson},
        spacing: ${dimensionsJson},
        borderRadius: ${borderRadiusJson},
        fontSize: ${fontSizeJson},
        lineHeight: ${lineHeightJson},
        fontWeight: ${fontWeightJson},
        transitionDuration: ${durationJson},
        transitionTimingFunction: ${timingFunctionJson},
      }
    }
  }
);`;

  return pluginCode;
}
