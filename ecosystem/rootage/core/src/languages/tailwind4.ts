/**
 * Tailwind CSS 4.0 테마 변수 생성 모듈
 * Tailwind 4.0 @theme 변수 생성
 */

import type {
  ComponentSpecDeclaration,
  GradientLit,
  TokenDeclaration as ASTTokenDeclaration,
} from "../parser/ast";
import { convertToKebabCase } from "../utils/string";
import { kebabCase } from "change-case";

// AST에서 가져온 TokenDeclaration 타입을 사용합니다

interface ThemeGenerationOptions {
  prefix?: string;
  sourcePrefix?: string;
  banner?: string;
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

// 타이포그래피 스타일 매핑 클래스
class TypographyStyleManager {
  private typographyStyles = new Map<string, Map<string, string[]>>();
  private textStyleVariants = new Set<string>();

  addTextStyleVariant(variant: string) {
    this.textStyleVariants.add(variant);
  }

  getOrCreateStyle(utilName: string): Map<string, string[]> {
    if (!this.typographyStyles.has(utilName)) {
      this.typographyStyles.set(utilName, new Map<string, string[]>());
    }
    return this.typographyStyles.get(utilName)!;
  }

  getStyles(): Map<string, Map<string, string[]>> {
    return this.typographyStyles;
  }

  getTextStyleVariants(): Set<string> {
    return this.textStyleVariants;
  }
}

// 토큰 처리 클래스
class TokenProcessor {
  private themeDeclarations: string[] = [];
  private typographyManager = new TypographyStyleManager();
  private gradientStops: Record<string, string> = {};
  private gradientDirections: Record<string, string> = {};

  constructor(
    private options: {
      prefix?: string;
      sourcePrefix?: string;
    },
  ) {}

  processTokens(tokens: ASTTokenDeclaration[]): void {
    for (const token of tokens) {
      const tokenGroup = token.token.group;
      if (tokenGroup.length === 0) continue;

      this.processToken(token, tokenGroup);
    }
  }

  private processToken(token: ASTTokenDeclaration, tokenGroup: string[]): void {
    const groupStr = tokenGroup.join("-");
    const keyStr = token.token.key ? `-${token.token.key.toString().replaceAll(".", "-")}` : "";

    const originalName = `--${this.options.sourcePrefix}-${groupStr}${
      tokenGroup.length > 0 && token.token.key ? "-" : ""
    }${token.token.key}`;

    const newPrefix = this.options.prefix ? `${this.options.prefix}-` : "";
    const newName = `--${newPrefix}${groupStr}${keyStr}`;

    // 모든 변수를 포함
    this.themeDeclarations.push(`  ${newName}: var(${originalName});`);

    // 특별 처리: gradient 토큰
    if (groupStr === "gradient") {
      this.processGradientToken(token, newName);
    }

    // 타이포그래피 관련 토큰 처리
    this.processTypographyRelatedToken(groupStr, keyStr, newName);
  }

  private processGradientToken(token: ASTTokenDeclaration, newName: string): void {
    const gradientKey = newName.replace(/^--.*?gradient-/, "");

    // 실제 gradient 값으로 변환된 선언 추가
    if (token.kind === "GradientTokenDeclaration") {
      const themeLight = token.values.find((v) => v.mode === "theme-light");
      if (themeLight?.value && themeLight.value.kind === "GradientLit") {
        const gradientCss = gradientToColorStops(themeLight.value, this.options.sourcePrefix);

        // gradient stops를 colors에 사용하기 위해 저장
        this.gradientStops[`gradient-stops-${gradientKey}`] = gradientCss;

        // 방향성 유틸리티들 추가
        this.gradientDirections[`${gradientKey}-to-t`] = `linear-gradient(to top, ${gradientCss})`;
        this.gradientDirections[`${gradientKey}-to-tr`] =
          `linear-gradient(to top right, ${gradientCss})`;
        this.gradientDirections[`${gradientKey}-to-r`] =
          `linear-gradient(to right, ${gradientCss})`;
        this.gradientDirections[`${gradientKey}-to-br`] =
          `linear-gradient(to bottom right, ${gradientCss})`;
        this.gradientDirections[`${gradientKey}-to-b`] =
          `linear-gradient(to bottom, ${gradientCss})`;
        this.gradientDirections[`${gradientKey}-to-bl`] =
          `linear-gradient(to bottom left, ${gradientCss})`;
        this.gradientDirections[`${gradientKey}-to-l`] = `linear-gradient(to left, ${gradientCss})`;
        this.gradientDirections[`${gradientKey}-to-tl`] =
          `linear-gradient(to top left, ${gradientCss})`;
      }
    }
  }

  private processTypographyRelatedToken(groupStr: string, keyStr: string, newName: string): void {
    if (groupStr.startsWith("font-size-t") && keyStr) {
      const sizeName = keyStr.substring(1);
      const match = sizeName.match(/^t(\d+)/);
      if (match) {
        const tLevel = match[0];
        this.addTypographyVariants(tLevel, newName, "font-size");
      }
    }

    if (groupStr.startsWith("line-height-t") && keyStr) {
      const heightName = keyStr.substring(1);
      const match = heightName.match(/^t(\d+)/);
      if (match) {
        const tLevel = match[0];
        this.addTypographyVariants(tLevel, newName, "line-height");
      }
    }

    if (groupStr === "font-weight") {
      const weightName = keyStr.substring(1);
      this.typographyManager.getTextStyleVariants().forEach((utilName) => {
        if (utilName.endsWith(`-${weightName}`)) {
          const styleMap = this.typographyManager.getOrCreateStyle(utilName);
          styleMap.set("font-weight", [`var(${newName})`]);
        }
      });
    }
  }

  private addTypographyVariants(tLevel: string, newName: string, property: string): void {
    ["regular", "medium", "bold"].forEach((weight) => {
      const utilName = `${tLevel}-${weight}`;
      this.typographyManager.addTextStyleVariant(utilName);

      const styleMap = this.typographyManager.getOrCreateStyle(utilName);
      styleMap.set(property, [`var(${newName})`]);
    });
  }

  getThemeDeclarations(): string[] {
    return this.themeDeclarations;
  }

  getTypographyManager(): TypographyStyleManager {
    return this.typographyManager;
  }

  getGradientStops(): Record<string, string> {
    return this.gradientStops;
  }

  getGradientDirections(): Record<string, string> {
    return this.gradientDirections;
  }
}

// 유틸리티 생성 클래스
class UtilityGenerator {
  private utilityDeclarations: string[] = [];

  generateTypographyUtilities(typographyManager: TypographyStyleManager): void {
    typographyManager.getStyles().forEach((styleMap, utilName) => {
      const styleLines: string[] = [];

      styleMap.forEach((values, property) => {
        const value = values.join(" ");
        styleLines.push(`  ${property}: ${value};`);
      });

      if (styleLines.length > 0) {
        this.utilityDeclarations.push(`@utility ${utilName} {
${styleLines.join("\n")}
}`);
      }
    });
  }

  generateComponentUtilities(
    typographyTokens: ComponentSpecDeclaration[],
    sourcePrefix: string,
  ): void {
    const componentUtilities: string[] = [];
    this.processTypographyComponents(typographyTokens, componentUtilities, sourcePrefix);

    componentUtilities.forEach((utility) => {
      const match = utility.match(/^\s*\.([a-zA-Z0-9_-]+)\s*{/);
      if (match?.[1]) {
        const className = match[1];
        const kebabClassName = convertToKebabCase(className);
        const utilName = `${kebabClassName}`;

        const utilityContent = utility.replace(
          /^\s*\.([a-zA-Z0-9_-]+)\s*{/,
          `@utility ${utilName} {`,
        );
        this.utilityDeclarations.push(utilityContent);
      }
    });
  }

  generateDimensionUtilities(): void {
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

    Object.entries(dimensionUtilities).forEach(([name, props]) => {
      this.utilityDeclarations.push(this.createUtilityDeclaration(name, props));
    });
  }

  generateOtherUtilities(): void {
    const otherUtilities = {
      "radius-*": { borderRadius: "--radius-*" },
      "text-size-*": { fontSize: "--font-size-*" },
      "leading-*": { lineHeight: "--line-height-*" },
      "font-*": { fontWeight: "--font-weight-*" },
      "duration-*": { transitionDuration: "--duration-*" },
      "easing-*": { transitionTimingFunction: "--timing-function-*" },
      "shadow-*": { boxShadow: "--shadow-*" },
    };

    Object.entries(otherUtilities).forEach(([name, props]) => {
      this.utilityDeclarations.push(this.createUtilityDeclaration(name, props));
    });
  }

  generateGradientArbitraryUtilities(gradientStops: Record<string, string>): void {
    Object.keys(gradientStops).forEach((gradientStop) => {
      const gradientName = gradientStop.replace("stops-", "");
      this.utilityDeclarations.push(`@utility bg-${gradientName}-* {
  background-image: linear-gradient(--value([angle]), var(--${gradientStop}));
}`);
    });
  }

  private createUtilityDeclaration(name: string, props: Record<string, string>): string {
    const styleLines = Object.entries(props).map(([prop, value]) => {
      const cssProperty = kebabCase(prop);
      if (value.startsWith("--")) {
        return `  ${cssProperty}: --value(${value});`;
      }
      return `  ${cssProperty}: ${value};`;
    });

    return `@utility ${name} {
${styleLines.join("\n")}
}`;
  }

  private processTypographyComponents(
    typographyTokens: ComponentSpecDeclaration[],
    typographyUtilities: string[],
    sourcePrefix: string,
  ): void {
    for (const typographyToken of typographyTokens) {
      if (!typographyToken?.body) continue;

      for (const variant of typographyToken.body) {
        if (!variant.variants.some((v) => v.name === "textStyle")) continue;

        const textStyleVariant = variant.variants.find((v) => v.name === "textStyle");
        if (!textStyleVariant) continue;

        const className = textStyleVariant.value;

        for (const state of variant.body) {
          if (!state.states.some((s: { value: string }) => s.value === "enabled")) continue;

          for (const slot of state.body) {
            const slotName = slot.slot || "root";
            if (slotName !== "root") continue;

            const typographyStyles: string[] = [];

            for (const prop of slot.body) {
              this.processTypographyProperty(prop, typographyStyles, sourcePrefix);
            }

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

  private processTypographyProperty(
    prop: any,
    typographyStyles: string[],
    sourcePrefix: string,
  ): void {
    if (prop.property === "fontSize" && "value" in prop) {
      if (prop.kind === "DimensionPropertyDeclaration") {
        if (prop.value.kind === "TokenLit") {
          const tokenId = prop.value.identifier.replace(/\$/g, "").replace(/\./g, "-");
          typographyStyles.push(`    font-size: var(--${sourcePrefix}-${tokenId});`);
        } else if (prop.value.kind === "DimensionLit") {
          typographyStyles.push(`    font-size: ${prop.value.value}${prop.value.unit};`);
        }
      }
    }

    if (prop.property === "lineHeight" && "value" in prop) {
      if (
        prop.kind === "NumberPropertyDeclaration" ||
        prop.kind === "DimensionPropertyDeclaration"
      ) {
        if (prop.value.kind === "TokenLit") {
          const tokenId = prop.value.identifier.replace(/\$/g, "").replace(/\./g, "-");
          typographyStyles.push(`    line-height: var(--${sourcePrefix}-${tokenId});`);
        } else if ("value" in prop.value) {
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
        if (prop.value.kind === "TokenLit") {
          const tokenId = prop.value.identifier.replace(/\$/g, "").replace(/\./g, "-");
          typographyStyles.push(`    font-weight: var(--${sourcePrefix}-${tokenId});`);
        } else if (prop.value.kind === "NumberLit") {
          typographyStyles.push(`    font-weight: ${prop.value.value};`);
        }
      }
    }
  }

  getUtilityDeclarations(): string[] {
    return this.utilityDeclarations;
  }
}

/**
 * Tailwind CSS 4.0에서 디자인 토큰을 사용하기 위한 @theme 코드를 생성
 * Tailwind 4.0은 @theme 디렉티브를 통해 테마 변수를 정의하고 유틸리티 클래스를 생성
 */
export function getTailwind4CompleteThemeCode(
  tokens: ASTTokenDeclaration[],
  typographyTokens: ComponentSpecDeclaration[],
  options: ThemeGenerationOptions = {},
): string {
  const { prefix = "", sourcePrefix = "" } = options;

  // 토큰 처리
  const tokenProcessor = new TokenProcessor({ prefix, sourcePrefix });
  tokenProcessor.processTokens(tokens);

  // 유틸리티 생성
  const utilityGenerator = new UtilityGenerator();
  utilityGenerator.generateTypographyUtilities(tokenProcessor.getTypographyManager());
  utilityGenerator.generateComponentUtilities(typographyTokens, sourcePrefix);
  utilityGenerator.generateDimensionUtilities();
  utilityGenerator.generateOtherUtilities();
  utilityGenerator.generateGradientArbitraryUtilities(tokenProcessor.getGradientStops());

  // 테마 코드 생성
  const themeDeclarations = tokenProcessor.getThemeDeclarations();
  const gradientStops = tokenProcessor.getGradientStops();
  const gradientDirections = tokenProcessor.getGradientDirections();
  const utilityDeclarations = utilityGenerator.getUtilityDeclarations();

  // gradient stops를 colors로 추가
  const colorDeclarations: string[] = [];
  Object.entries(gradientStops).forEach(([key, value]) => {
    colorDeclarations.push(`  --${key}: ${value};`);
  });

  // gradient 방향성 유틸리티를 gradient로 추가
  const gradientDirectionDeclarations: string[] = [];
  Object.entries(gradientDirections).forEach(([key, value]) => {
    gradientDirectionDeclarations.push(`  --gradient-${key}: ${value};`);
  });

  const allThemeDeclarations = [
    ...themeDeclarations,
    ...colorDeclarations,
    ...gradientDirectionDeclarations,
  ];

  return `${options.banner ?? ""}@theme {
${allThemeDeclarations.join("\n")}
}

${utilityDeclarations.join("\n\n")}`;
}
