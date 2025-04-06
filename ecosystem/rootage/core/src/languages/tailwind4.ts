/**
 * Tailwind CSS 4.0 테마 변수 생성 모듈
 * @seed-design/tailwind4 패키지를 위한 @theme 변수 생성
 */

import type { ComponentSpecDeclaration } from "../parser/ast";
import { convertToKebabCase } from "../utils/string";

interface TokenValue {
  mode: string;
  value: any;
}

interface TokenDeclaration {
  token: {
    group: string[];
    key: string;
  };
  collection: string;
  values: TokenValue[];
}

/**
 * Tailwind CSS 4.0에서 SEED 디자인 토큰을 사용하기 위한 @theme 코드를 생성
 * Tailwind 4.0은 @theme 디렉티브를 통해 테마 변수를 정의하고 유틸리티 클래스를 생성
 *
 * @param tokens 모든 토큰 정보
 * @param typographyTokens 타이포그래피 컴포넌트 스펙 정보
 * @param options 테마 변수 생성 옵션
 * @returns 생성된 Tailwind 4.0 테마 코드
 */
export function getTailwind4CompleteThemeCode(
  tokens: TokenDeclaration[],
  typographyTokens: ComponentSpecDeclaration[],
  options: {
    prefix?: string;
    sourcePrefix?: string;
    banner?: string;
  } = {},
) {
  const { prefix = "", sourcePrefix = "seed" } = options;

  // 토큰 선언을 저장할 객체 초기화
  const themeDeclarations: string[] = [];

  // 유틸리티 선언을 저장할 객체 초기화
  const utilityDeclarations: string[] = [];

  // 타이포그래피 스타일 매핑
  const typographyStyles = new Map<string, Map<string, string[]>>();

  // 텍스트 스타일 매핑 (text-style-t1-regular, text-style-t1-medium 등)
  const textStyleVariants = new Set<string>();

  // 모든 토큰 처리
  for (const token of tokens) {
    // 토큰 그룹이 비어있으면 스킵
    const tokenGroup = token.token.group;
    if (tokenGroup.length === 0) continue;

    // 그룹과 키를 기반으로 CSS 변수 이름 생성
    const groupStr = tokenGroup.join("-");
    const keyStr = token.token.key ? `-${token.token.key.toString().replaceAll(".", "-")}` : "";

    // 첫 번째 그룹 요소 판단하여 적절한 접두사 사용
    // CSS 변수 이름 생성 (tailwind3와 동일한 방식 적용)
    const originalName = `--${sourcePrefix}-${groupStr}${
      tokenGroup.length > 0 && token.token.key ? "-" : ""
    }${token.token.key}`;

    // 새 이름 생성 (접두사 적용)
    const newPrefix = prefix ? `${prefix}-` : "";
    const newName = `--${newPrefix}${groupStr}${keyStr}`;

    // 모든 변수를 무조건 포함
    themeDeclarations.push(`  ${newName}: var(${originalName});`);

    // 타이포그래피 스타일 관련 토큰 처리
    if (groupStr.startsWith("font-size-t") && keyStr) {
      const sizeName = keyStr.substring(1); // '-' 제거

      // 'font-size-t1', 'font-size-t2' 등에서 't1', 't2' 추출
      const match = sizeName.match(/^t(\d+)/);
      if (match) {
        const tLevel = match[0]; // t1, t2, ...

        // 정규표현식으로 추출한 t-level을 저장
        ["regular", "medium", "bold"].forEach((weight) => {
          // text-style- 접두사 사용
          const utilName = `text-style-${tLevel}-${weight}`;
          textStyleVariants.add(utilName);

          if (!typographyStyles.has(utilName)) {
            typographyStyles.set(utilName, new Map<string, string[]>());
          }

          const styleMap = typographyStyles.get(utilName);
          if (styleMap) {
            styleMap.set("font-size", [`var(${newName})`]);
          }
        });
      }
    }

    if (groupStr.startsWith("line-height-t") && keyStr) {
      const heightName = keyStr.substring(1); // '-' 제거

      // 'line-height-t1', 'line-height-t2' 등에서 't1', 't2' 추출
      const match = heightName.match(/^t(\d+)/);
      if (match) {
        const tLevel = match[0]; // t1, t2, ...

        // line-height 정보를 저장
        ["regular", "medium", "bold"].forEach((weight) => {
          // text-style- 접두사 사용
          const utilName = `text-style-${tLevel}-${weight}`;

          if (typographyStyles.has(utilName)) {
            const styleMap = typographyStyles.get(utilName);
            if (styleMap) {
              styleMap.set("line-height", [`var(${newName})`]);
            }
          }
        });
      }
    }

    if (groupStr === "font-weight") {
      // font-weight-regular, font-weight-medium, font-weight-bold
      const weightName = keyStr.substring(1); // '-' 제거

      // 모든 t-level에 대해 해당 weight 설정
      textStyleVariants.forEach((utilName) => {
        if (utilName.endsWith(`-${weightName}`)) {
          const styleMap = typographyStyles.get(utilName);
          if (styleMap) {
            styleMap.set("font-weight", [`var(${newName})`]);
          }
        }
      });
    }
  }

  // 컴포넌트 스펙에서 추가 타이포그래피 스타일 생성
  if (typographyTokens && typographyTokens.length > 0) {
    // 컴포넌트 스펙 기반 스타일을 저장할 배열
    const componentUtilities: string[] = [];
    processTailwindTypography(typographyTokens, componentUtilities, sourcePrefix);

    // 컴포넌트 스펙 기반 유틸리티를 추가
    componentUtilities.forEach((utility) => {
      // .className { ... } 형식을 @utility className { ... } 형식으로 변환
      const match = utility.match(/^\s*\.([a-zA-Z0-9_-]+)\s*{/);
      if (match?.[1]) {
        const className = match[1];
        // className을 kebab-case로 변환
        const kebabClassName = convertToKebabCase(className);
        // text-style- 접두사 사용
        const utilName = `text-style-${kebabClassName}`;

        const utilityContent = utility.replace(
          /^\s*\.([a-zA-Z0-9_-]+)\s*{/,
          `@utility ${utilName} {`,
        );
        utilityDeclarations.push(utilityContent);
      }
    });
  }

  // 타이포그래피 유틸리티 생성
  typographyStyles.forEach((styleMap, utilName) => {
    const styleLines: string[] = [];

    styleMap.forEach((values, property) => {
      const value = values.join(" ");
      styleLines.push(`  ${property}: ${value};`);
    });

    if (styleLines.length > 0) {
      utilityDeclarations.push(`@utility ${utilName} {
${styleLines.join("\n")}
}`);
    }
  });

  // 와일드카드 유틸리티 생성
  // Tailwind3와 동일한 유틸리티 패턴을 적용하기 위한 객체 생성
  const dimensionUtilities = {
    "size-*": { width: "--dimension-*", height: "--dimension-*" },
    "w-*": { width: "--dimension-*" },
    "h-*": { height: "--dimension-*" },
    "p-*": { padding: "--dimension-*" },
    "pt-*": { paddingTop: "--dimension-*" },
    "pb-*": { paddingBottom: "--dimension-*" },
    "pl-*": { paddingLeft: "--dimension-*" },
    "pr-*": { paddingRight: "--dimension-*" },
    "px-*": { paddingLeft: "--dimension-*", paddingRight: "--dimension-*" },
    "py-*": { paddingTop: "--dimension-*", paddingBottom: "--dimension-*" },
    "m-*": { margin: "--dimension-*" },
    "mt-*": { marginTop: "--dimension-*" },
    "mb-*": { marginBottom: "--dimension-*" },
    "ml-*": { marginLeft: "--dimension-*" },
    "mr-*": { marginRight: "--dimension-*" },
    "mx-*": { marginLeft: "--dimension-*", marginRight: "--dimension-*" },
    "my-*": { marginTop: "--dimension-*", marginBottom: "--dimension-*" },
    "gap-*": { gap: "--dimension-*" },
    "gap-x-*": { columnGap: "--dimension-*" },
    "gap-y-*": { rowGap: "--dimension-*" },
  };

  // 유틸리티 생성 함수
  const createUtilityDeclaration = (name: string, props: Record<string, string>) => {
    const styleLines = Object.entries(props).map(([prop, value]) => {
      // --dimension-* 형식의 값을 var(--dimension- --value(--dimension-*, *)) 형식으로 변환
      if (value.startsWith("--")) {
        const [prefix] = value.split("-*");
        return `  ${prop}: var(${prefix}- --value(${value}, *));`;
      }
      return `  ${prop}: ${value};`;
    });

    return `@utility ${name} {
${styleLines.join("\n")}
}`;
  };

  // 차원 관련 유틸리티 생성
  utilityDeclarations.length = 0; // 기존 선언을 지우고 새로 생성

  // 타이포그래피 유틸리티 먼저 추가
  typographyStyles.forEach((styleMap, utilName) => {
    const styleLines: string[] = [];

    styleMap.forEach((values, property) => {
      const value = values.join(" ");
      styleLines.push(`  ${property}: ${value};`);
    });

    if (styleLines.length > 0) {
      utilityDeclarations.push(`@utility ${utilName} {
${styleLines.join("\n")}
}`);
    }
  });

  // 컴포넌트 스펙에서 추가 타이포그래피 스타일 생성
  if (typographyTokens && typographyTokens.length > 0) {
    // 컴포넌트 스펙 기반 스타일을 저장할 배열
    const componentUtilities: string[] = [];
    processTailwindTypography(typographyTokens, componentUtilities, sourcePrefix);

    // 컴포넌트 스펙 기반 유틸리티를 추가
    componentUtilities.forEach((utility) => {
      // .className { ... } 형식을 @utility className { ... } 형식으로 변환
      const match = utility.match(/^\s*\.([a-zA-Z0-9_-]+)\s*{/);
      if (match?.[1]) {
        const className = match[1];
        // className을 kebab-case로 변환
        const kebabClassName = convertToKebabCase(className);
        // text-style- 접두사 사용
        const utilName = `text-style-${kebabClassName}`;

        const utilityContent = utility.replace(
          /^\s*\.([a-zA-Z0-9_-]+)\s*{/,
          `@utility ${utilName} {`,
        );
        utilityDeclarations.push(utilityContent);
      }
    });
  }

  // 크기 관련 유틸리티 추가
  Object.entries(dimensionUtilities).forEach(([name, props]) => {
    utilityDeclarations.push(createUtilityDeclaration(name, props));
  });

  // 추가적인 유틸리티 (Tailwind3와 일치시키기 위한 항목들)
  const otherUtilities = {
    "radius-*": { borderRadius: "--radius-*" },
    "text-size-*": { fontSize: "--font-size-*" },
    "leading-*": { lineHeight: "--line-height-*" },
    "font-*": { fontWeight: "--font-weight-*" },
    "duration-*": { transitionDuration: "--duration-*" },
    "easing-*": { transitionTimingFunction: "--timing-function-*" },
  };

  Object.entries(otherUtilities).forEach(([name, props]) => {
    utilityDeclarations.push(createUtilityDeclaration(name, props));
  });

  // 테마 코드 생성 시작
  const themeCode = `${options.banner ?? ""}@theme {
${themeDeclarations.join("\n")}
}

${utilityDeclarations.join("\n\n")}`;

  return themeCode;
}

/**
 * 타이포그래피 컴포넌트 스펙을 처리하여 Tailwind 4.0 유틸리티 생성
 */
function processTailwindTypography(
  typographyTokens: ComponentSpecDeclaration[],
  typographyUtilities: string[],
  sourcePrefix = "seed",
): void {
  // 타이포그래피 토큰 처리 (ComponentSpecDeclaration에서 추출)
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
                  const typographyStyles: string[] = [];

                  for (const prop of slot.body) {
                    if (prop.property === "fontSize" && "value" in prop) {
                      if (prop.kind === "DimensionPropertyDeclaration") {
                        // token 참조인 경우
                        if (prop.value.kind === "TokenLit") {
                          const tokenId = prop.value.identifier.replace("$", "").replace(".", "-");
                          typographyStyles.push(
                            `    font-size: var(--${sourcePrefix}-${tokenId});`,
                          );
                        }
                        // 직접 값인 경우
                        else if (prop.value.kind === "DimensionLit") {
                          typographyStyles.push(
                            `    font-size: ${prop.value.value}${prop.value.unit};`,
                          );
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
                          const tokenId = prop.value.identifier.replace("$", "").replace(".", "-");
                          typographyStyles.push(
                            `    line-height: var(--${sourcePrefix}-${tokenId});`,
                          );
                        }
                        // 직접 값인 경우 (NumberLit 또는 DimensionLit)
                        else if ("value" in prop.value) {
                          typographyStyles.push(
                            prop.value.kind === "DimensionLit"
                              ? `    line-height: ${prop.value.value}${prop.value.unit};`
                              : `    line-height: ${prop.value.value};`,
                          );
                        }
                      }
                    }

                    if (prop.property === "fontWeight" && "value" in prop) {
                      if (prop.kind === "NumberPropertyDeclaration") {
                        // token 참조인 경우
                        if (prop.value.kind === "TokenLit") {
                          const tokenId = prop.value.identifier.replace("$", "").replace(".", "-");
                          typographyStyles.push(
                            `    font-weight: var(--${sourcePrefix}-${tokenId});`,
                          );
                        }
                        // 직접 값인 경우
                        else if (prop.value.kind === "NumberLit") {
                          typographyStyles.push(`    font-weight: ${prop.value.value};`);
                        }
                      }
                    }
                  }

                  // 스타일 정보가 있으면 저장
                  if (typographyStyles.length > 0) {
                    typographyUtilities.push(`  .${className} {
${typographyStyles.join("\n")}
  }`);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
