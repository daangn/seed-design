import type { TokenDeclaration } from "../parser/ast";

// Tailwind 플러그인 코드 생성 함수
export function getTailwindPluginCode(tokens: TokenDeclaration[]): string {
  // 색상 토큰을 저장할 객체 초기화 (플랫하게 모든 색상을 저장)
  const flatColors: Record<string, string> = {};
  // 타이포그래피 토큰을 저장할 객체 초기화
  const flatTypography: Record<string, Record<string, string>> = {};

  // 색상 컬렉션에서 토큰 필터링
  const colorTokensAll = tokens.filter((token) => token.collection === "color");

  // 컴포넌트 컬렉션에서 타이포그래피 토큰 필터링
  console.log("Token collections:", [...new Set(tokens.map((t) => t.collection))].join(", "));

  const typographyTokensAll = tokens.filter(
    (token) => token.collection === "component" && token.token.group[0] === "textStyle",
  );

  console.log("Typography tokens count:", typographyTokensAll.length);

  // 모든 색상 토큰 처리
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

  // 타이포그래피 토큰 처리
  for (const token of typographyTokensAll) {
    if (token.token.key) {
      // textStyle=t1Regular, textStyle=screenTitle 등에서 클래스 이름 생성
      const className = token.token.key;

      // 토큰에서 enabled.root 값 추출
      const tokenValues = token.values;
      if (tokenValues && typeof tokenValues === "object" && Array.isArray(tokenValues)) {
        // values 배열의 첫 번째 항목에서 스타일 추출 시도
        const firstValue = tokenValues[0];
        if (firstValue && typeof firstValue === "object" && "enabled" in firstValue) {
          const styles = (firstValue as any).enabled?.root;

          if (styles) {
            // CSS 변수로 변환하여 스타일을 저장
            const typographyStyles: Record<string, string> = {};

            if (styles.fontSize) {
              typographyStyles.fontSize = `var(--seed-${styles.fontSize.replace("$", "").replace(".", "-")})`;
            }

            if (styles.lineHeight) {
              typographyStyles.lineHeight = `var(--seed-${styles.lineHeight.replace("$", "").replace(".", "-")})`;
            }

            if (styles.fontWeight) {
              typographyStyles.fontWeight = `var(--seed-${styles.fontWeight.replace("$", "").replace(".", "-")})`;
            }

            flatTypography[className] = typographyStyles;
          }
        }
      }
    }
  }

  // 타이포그래피 토큰이 없는 경우 타이포그래피 스타일 수동 정의
  if (Object.keys(flatTypography).length === 0) {
    console.log("Typography tokens not found, adding manually");

    // 수동으로 타이포그래피 스타일 추가
    flatTypography["screenTitle"] = {
      fontSize: "var(--seed-font-size-t10)",
      lineHeight: "var(--seed-line-height-t10)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
    flatTypography["articleBody"] = {
      fontSize: "var(--seed-font-size-t5)",
      lineHeight: "var(--seed-line-height-t6)",
      fontWeight: "var(--seed-font-weight-regular)",
    };
    flatTypography["t1Regular"] = {
      fontSize: "var(--seed-font-size-t1)",
      lineHeight: "var(--seed-line-height-t1)",
      fontWeight: "var(--seed-font-weight-regular)",
    };
    flatTypography["t1Medium"] = {
      fontSize: "var(--seed-font-size-t1)",
      lineHeight: "var(--seed-line-height-t1)",
      fontWeight: "var(--seed-font-weight-medium)",
    };
    flatTypography["t1Bold"] = {
      fontSize: "var(--seed-font-size-t1)",
      lineHeight: "var(--seed-line-height-t1)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
    flatTypography["t2Regular"] = {
      fontSize: "var(--seed-font-size-t2)",
      lineHeight: "var(--seed-line-height-t2)",
      fontWeight: "var(--seed-font-weight-regular)",
    };
    flatTypography["t2Medium"] = {
      fontSize: "var(--seed-font-size-t2)",
      lineHeight: "var(--seed-line-height-t2)",
      fontWeight: "var(--seed-font-weight-medium)",
    };
    flatTypography["t2Bold"] = {
      fontSize: "var(--seed-font-size-t2)",
      lineHeight: "var(--seed-line-height-t2)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
    flatTypography["t3Regular"] = {
      fontSize: "var(--seed-font-size-t3)",
      lineHeight: "var(--seed-line-height-t3)",
      fontWeight: "var(--seed-font-weight-regular)",
    };
    flatTypography["t3Medium"] = {
      fontSize: "var(--seed-font-size-t3)",
      lineHeight: "var(--seed-line-height-t3)",
      fontWeight: "var(--seed-font-weight-medium)",
    };
    flatTypography["t3Bold"] = {
      fontSize: "var(--seed-font-size-t3)",
      lineHeight: "var(--seed-line-height-t3)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
    flatTypography["t4Regular"] = {
      fontSize: "var(--seed-font-size-t4)",
      lineHeight: "var(--seed-line-height-t4)",
      fontWeight: "var(--seed-font-weight-regular)",
    };
    flatTypography["t4Medium"] = {
      fontSize: "var(--seed-font-size-t4)",
      lineHeight: "var(--seed-line-height-t4)",
      fontWeight: "var(--seed-font-weight-medium)",
    };
    flatTypography["t4Bold"] = {
      fontSize: "var(--seed-font-size-t4)",
      lineHeight: "var(--seed-line-height-t4)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
    flatTypography["t5Regular"] = {
      fontSize: "var(--seed-font-size-t5)",
      lineHeight: "var(--seed-line-height-t5)",
      fontWeight: "var(--seed-font-weight-regular)",
    };
    flatTypography["t5Medium"] = {
      fontSize: "var(--seed-font-size-t5)",
      lineHeight: "var(--seed-line-height-t5)",
      fontWeight: "var(--seed-font-weight-medium)",
    };
    flatTypography["t5Bold"] = {
      fontSize: "var(--seed-font-size-t5)",
      lineHeight: "var(--seed-line-height-t5)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
    flatTypography["t6Regular"] = {
      fontSize: "var(--seed-font-size-t6)",
      lineHeight: "var(--seed-line-height-t6)",
      fontWeight: "var(--seed-font-weight-regular)",
    };
    flatTypography["t6Medium"] = {
      fontSize: "var(--seed-font-size-t6)",
      lineHeight: "var(--seed-line-height-t6)",
      fontWeight: "var(--seed-font-weight-medium)",
    };
    flatTypography["t6Bold"] = {
      fontSize: "var(--seed-font-size-t6)",
      lineHeight: "var(--seed-line-height-t6)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
    flatTypography["t7Regular"] = {
      fontSize: "var(--seed-font-size-t7)",
      lineHeight: "var(--seed-line-height-t7)",
      fontWeight: "var(--seed-font-weight-regular)",
    };
    flatTypography["t7Medium"] = {
      fontSize: "var(--seed-font-size-t7)",
      lineHeight: "var(--seed-line-height-t7)",
      fontWeight: "var(--seed-font-weight-medium)",
    };
    flatTypography["t7Bold"] = {
      fontSize: "var(--seed-font-size-t7)",
      lineHeight: "var(--seed-line-height-t7)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
    flatTypography["t8Bold"] = {
      fontSize: "var(--seed-font-size-t8)",
      lineHeight: "var(--seed-line-height-t8)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
    flatTypography["t9Bold"] = {
      fontSize: "var(--seed-font-size-t9)",
      lineHeight: "var(--seed-line-height-t9)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
    flatTypography["t10Bold"] = {
      fontSize: "var(--seed-font-size-t10)",
      lineHeight: "var(--seed-line-height-t10)",
      fontWeight: "var(--seed-font-weight-bold)",
    };
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
