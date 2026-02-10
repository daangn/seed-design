import type { ComponentSpecDeclaration, TokenDeclaration, GradientLit } from "../parser/ast";
import { convertToKebabCase } from "../utils/string";

// 토큰 타입별 저장소 인터페이스
interface TokenCollections {
  colors: Record<string, string>;
  gradients: Record<string, string>;
  dimensions: Record<string, string>;
  radius: Record<string, string>;
  fontSize: Record<string, string>;
  lineHeight: Record<string, string>;
  fontWeight: Record<string, string>;
  duration: Record<string, string>;
  timingFunction: Record<string, string>;
  boxShadow: Record<string, string>;
  typography: Record<string, Record<string, string>>;
}

// Gradient를 색상 stops만으로 변환하는 함수 (방향 없이)
function gradientToColorStops(gradient: GradientLit, prefix?: string): string {
  return gradient.stops
    .map((stop) => {
      let color: string;
      if (stop.color.kind === "ColorHexLit") {
        color = stop.color.value;
      } else {
        const tokenId = stop.color.identifier.replace(/\$/g, "").replace(/\./g, "-");
        const prefixPart = prefix ? `${prefix}-` : "";
        color = `var(--${prefixPart}${tokenId})`;
      }
      return `${color} ${(stop.position.value * 100).toFixed(2)}%`;
    })
    .join(", ");
}

// 토큰 키 생성 함수
function createTokenKey(tokenGroup: string[], tokenKey: string): string {
  return tokenGroup.join("-") + (tokenKey ? `-${tokenKey.replaceAll(".", "-")}` : "");
}

// CSS 변수명 생성 함수
function createCssVarName(tokenGroup: string[], tokenKey: string, prefix?: string): string {
  const prefixPart = prefix ? `${prefix}-` : "";
  return `--${prefixPart}${tokenGroup.join("-")}${tokenGroup.length > 0 && tokenKey ? "-" : ""}${tokenKey}`;
}

// 토큰 처리 함수
function processFoundationTokens(
  foundationTokens: TokenDeclaration[],
  options?: { prefix?: string; sourcePrefix?: string },
): TokenCollections {
  const collections: TokenCollections = {
    colors: {},
    gradients: {},
    dimensions: {},
    radius: {},
    fontSize: {},
    lineHeight: {},
    fontWeight: {},
    duration: {},
    timingFunction: {},
    boxShadow: {},
    typography: {},
  };

  for (const token of foundationTokens) {
    const tokenGroup = token.token.group;
    if (tokenGroup.length === 0) continue;

    const tokenKey = createTokenKey(tokenGroup, token.token.key || "");
    const cssVarName = createCssVarName(tokenGroup, token.token.key || "", options?.prefix);
    const cssVarValue = `var(${cssVarName})`;

    // 토큰 타입별 분류
    if (tokenGroup[0] === "color") {
      const relevantGroups = tokenGroup.slice(1);
      if (relevantGroups.length > 0) {
        const colorKey =
          relevantGroups.join("-") +
          (token.token.key ? `-${token.token.key.replaceAll(".", "-")}` : "");
        collections.colors[colorKey] = cssVarValue;
      }
    } else if (tokenGroup[0] === "gradient") {
      // gradient 토큰 처리 - 색상 stops만 제공하여 사용자가 방향을 자유롭게 설정할 수 있도록
      const gradientKey = tokenKey.substring(9); // "gradient-" 제거

      // 토큰에서 실제 gradient 값을 찾아서 색상 stops만 변환
      if (token.kind === "GradientTokenDeclaration") {
        const themeLight = token.values.find((v) => v.mode === "theme-light");
        if (themeLight?.value && themeLight.value.kind === "GradientLit") {
          const colorStops = gradientToColorStops(
            themeLight.value,
            options?.sourcePrefix || options?.prefix,
          );
          collections.gradients[gradientKey] = colorStops;

          // 방향성 유틸리티들 추가
          collections.gradients[`${gradientKey}-to-t`] = `linear-gradient(to top, ${colorStops})`;
          collections.gradients[`${gradientKey}-to-tr`] =
            `linear-gradient(to top right, ${colorStops})`;
          collections.gradients[`${gradientKey}-to-r`] = `linear-gradient(to right, ${colorStops})`;
          collections.gradients[`${gradientKey}-to-br`] =
            `linear-gradient(to bottom right, ${colorStops})`;
          collections.gradients[`${gradientKey}-to-b`] =
            `linear-gradient(to bottom, ${colorStops})`;
          collections.gradients[`${gradientKey}-to-bl`] =
            `linear-gradient(to bottom left, ${colorStops})`;
          collections.gradients[`${gradientKey}-to-l`] = `linear-gradient(to left, ${colorStops})`;
          collections.gradients[`${gradientKey}-to-tl`] =
            `linear-gradient(to top left, ${colorStops})`;
        } else {
          // fallback으로 CSS 변수 참조 - 방향 없는 gradient는 제거
        }
      } else {
        // fallback으로 CSS 변수 참조 - 방향 없는 gradient는 제거
      }
    } else if (tokenKey.startsWith("dimension-")) {
      collections.dimensions[tokenKey.substring(10)] = cssVarValue;
    } else if (tokenKey.startsWith("radius-")) {
      collections.radius[tokenKey.substring(7)] = cssVarValue;
    } else if (tokenKey.startsWith("font-size-")) {
      collections.fontSize[tokenKey.substring(10)] = cssVarValue;
    } else if (tokenKey.startsWith("line-height-")) {
      collections.lineHeight[tokenKey.substring(12)] = cssVarValue;
    } else if (tokenKey.startsWith("font-weight-")) {
      collections.fontWeight[tokenKey.substring(12)] = cssVarValue;
    } else if (tokenKey.startsWith("duration-")) {
      collections.duration[tokenKey.substring(9)] = cssVarValue;
    } else if (tokenKey.startsWith("timing-function-")) {
      collections.timingFunction[tokenKey.substring(16)] = cssVarValue;
    } else if (tokenKey.startsWith("shadow-")) {
      collections.boxShadow[tokenKey.substring(7)] = cssVarValue;
    }
  }

  return collections;
}

// 타이포그래피 토큰 처리 함수
function processTypographyTokens(
  typographyTokens: ComponentSpecDeclaration[],
  options?: { prefix?: string; sourcePrefix?: string },
): Record<string, Record<string, string>> {
  const flatTypography: Record<string, Record<string, string>> = {};

  for (const typographyToken of typographyTokens) {
    if (!typographyToken?.body) continue;

    for (const variant of typographyToken.body) {
      if (!variant.variants.some((v) => v.name === "textStyle")) continue;

      const textStyleVariant = variant.variants.find((v) => v.name === "textStyle");
      if (!textStyleVariant) continue;

      const className = textStyleVariant.value;
      const kebabClassName = convertToKebabCase(className);

      for (const state of variant.body) {
        if (!state.states.some((s: { value: string }) => s.value === "enabled")) continue;

        for (const slot of state.body) {
          const slotName = slot.slot || "root";
          if (slotName !== "root") continue;

          const typographyStyle: Record<string, string> = {};

          for (const prop of slot.body) {
            if (prop.property === "fontSize" && "value" in prop) {
              if (prop.kind === "DimensionPropertyDeclaration") {
                if (prop.value.kind === "TokenLit") {
                  const tokenPrefix = options?.sourcePrefix || options?.prefix;
                  const prefixPart = tokenPrefix ? `${tokenPrefix}-` : "";
                  typographyStyle.fontSize = `var(--${prefixPart}${prop.value.identifier.replace(/\$/g, "").replace(/\./g, "-")})`;
                } else if (prop.value.kind === "DimensionLit") {
                  typographyStyle.fontSize = `${prop.value.value}${prop.value.unit}`;
                }
              }
            }

            if (prop.property === "lineHeight" && "value" in prop) {
              if (
                prop.kind === "NumberPropertyDeclaration" ||
                prop.kind === "DimensionPropertyDeclaration"
              ) {
                if (prop.value.kind === "TokenLit") {
                  const tokenPrefix = options?.sourcePrefix || options?.prefix;
                  const prefixPart = tokenPrefix ? `${tokenPrefix}-` : "";
                  typographyStyle.lineHeight = `var(--${prefixPart}${prop.value.identifier.replace(/\$/g, "").replace(/\./g, "-")})`;
                } else if ("value" in prop.value) {
                  typographyStyle.lineHeight =
                    prop.value.kind === "DimensionLit"
                      ? `${prop.value.value}${prop.value.unit}`
                      : `${prop.value.value}`;
                }
              }
            }

            if (prop.property === "fontWeight" && "value" in prop) {
              if (prop.kind === "NumberPropertyDeclaration") {
                if (prop.value.kind === "TokenLit") {
                  const tokenPrefix = options?.sourcePrefix || options?.prefix;
                  const prefixPart = tokenPrefix ? `${tokenPrefix}-` : "";
                  typographyStyle.fontWeight = `var(--${prefixPart}${prop.value.identifier.replace(/\$/g, "").replace(/\./g, "-")})`;
                } else if (prop.value.kind === "NumberLit") {
                  typographyStyle.fontWeight = `${prop.value.value}`;
                }
              }
            }
          }

          if (Object.keys(typographyStyle).length > 0) {
            flatTypography[kebabClassName] = typographyStyle;
          }
        }
      }
    }
  }

  return flatTypography;
}

// Tailwind 플러그인 코드 생성 함수
export function getTailwind3PluginCode(
  foundationTokens: TokenDeclaration[],
  typographyTokens: ComponentSpecDeclaration[],
  options?: { prefix?: string; sourcePrefix?: string },
): string {
  // 토큰 처리
  const collections = processFoundationTokens(foundationTokens, options);
  const typography = processTypographyTokens(typographyTokens, options);

  // gradient stops를 colors에도 추가 (from-, via-, to- 유틸리티와 함께 사용 가능)
  const gradientStops: Record<string, string> = {};
  Object.entries(collections.gradients)
    .filter(([key]) => !key.includes("-to-"))
    .forEach(([key, value]) => {
      gradientStops[`gradient-stops-${key}`] = value;
    });

  const extendedColors = {
    ...collections.colors,
    ...gradientStops,
  };

  // backgroundImage에는 방향성이 있는 gradient만 추가 (-to-가 포함된 것들)
  const gradientBackgrounds: Record<string, string> = {};
  Object.entries(collections.gradients)
    .filter(([key]) => key.includes("-to-"))
    .forEach(([key, value]) => {
      gradientBackgrounds[key] = value;
    });

  // JSON 직렬화
  const serializeJson = (obj: any) => JSON.stringify(obj, null, 2);

  // Tailwind Plugin 코드 생성
  return `// @ts-nocheck
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
          acc[\`.\${key}\`] = value;
          return acc;
        }, {})
      );
    }

    // gradient arbitrary value 지원
    const gradientStopsForArbitrary = ${JSON.stringify(
      Object.fromEntries(
        Object.entries(collections.gradients)
          .filter(([key]) => !key.includes("-to-"))
          .map(([key, value]) => [key, value]),
      ),
      null,
      6,
    )};

    Object.entries(gradientStopsForArbitrary).forEach(([gradientName, colorStops]) => {
      matchUtilities(
        {
          [\`bg-gradient-\${gradientName}\`]: (value) => ({
            backgroundImage: \`linear-gradient(\${value}, \${colorStops})\`
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
        colors: ${serializeJson(extendedColors)},
        backgroundImage: ${serializeJson(gradientBackgrounds)},
        typography: ${serializeJson(typography)},
        spacing: ${serializeJson(collections.dimensions)},
        borderRadius: ${serializeJson(collections.radius)},
        fontSize: ${serializeJson(collections.fontSize)},
        lineHeight: ${serializeJson(collections.lineHeight)},
        fontWeight: ${serializeJson(collections.fontWeight)},
        transitionDuration: ${serializeJson(collections.duration)},
        transitionTimingFunction: ${serializeJson(collections.timingFunction)},
        boxShadow: ${serializeJson(collections.boxShadow)},
      },
    },
  },
);`;
}
