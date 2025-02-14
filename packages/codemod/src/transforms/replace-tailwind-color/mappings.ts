import { colorMappings } from "@seed-design/migration-index/color";
import { camelCase } from "change-case";

interface ColorMapping {
  previous: string;
  next: string[];
}

type ColorPrefix = "text" | "bg" | "stroke";

function selectNextTokensByPrefix(prefix: ColorPrefix, tokens: string[]): string[] {
  // 매핑이 하나면 그대로 사용
  if (tokens.length === 1) {
    return [tokens[0]];
  }

  // 매핑이 여러 개인 경우 prefix에 맞는 토큰 선택
  const prefixMap = {
    bg: "$color.bg",
    text: "$color.fg",
    stroke: "$color.stroke",
  };

  const matchingTokens = tokens.filter((token) => token.startsWith(prefixMap[prefix]));
  return matchingTokens.length > 0 ? matchingTokens : tokens;
}

function createColorMappings(prefix: ColorPrefix): ColorMapping[] {
  return colorMappings.map((mapping) => {
    // $semantic.color.gray-alpha-100 -> grayAlpha100
    const tokenName = mapping.previous
      .replace(/^\$(semantic|static|scale)\.color\./, "")
      .split(".")
      .join("-");

    return {
      // prefix-tokenName (e.g., bg-grayAlpha100)
      previous: `${prefix}-${camelCase(tokenName, { mergeAmbiguousCharacters: true })}`,
      next: selectNextTokensByPrefix(prefix, mapping.next).map((token) => {
        if (token.startsWith("$color.bg")) {
          return `${prefix}-${token.replace("$color.bg.", "")}`;
        }
        if (token.startsWith("$color.fg")) {
          return `${prefix}-${token.replace("$color.fg.", "")}`;
        }
        if (token.startsWith("$color.palette")) {
          return `${prefix}-${token.replace("$color.palette.", "")}`;
        }
        return token;
      }),
    };
  });
}

// hover:, focus:, active: 등의 상태에 대한 매핑
function createStateColorMappings(prefix: string, mappings: ColorMapping[]): ColorMapping[] {
  return mappings.map((mapping) => ({
    previous: `${prefix}:${mapping.previous}`,
    next: mapping.next.map((token) => `${prefix}:${token}`),
  }));
}

export const textColorMappings = createColorMappings("text");
export const bgColorMappings = createColorMappings("bg");

// 상태 매핑 생성
const states = ["hover", "focus", "active"] as const;
export const stateTextColorMappings = states.flatMap((state) =>
  createStateColorMappings(state, textColorMappings),
);
export const stateBgColorMappings = states.flatMap((state) =>
  createStateColorMappings(state, bgColorMappings),
);

// 모든 매핑을 하나로 합침
export const allColorMappings = [
  ...textColorMappings,
  ...bgColorMappings,
  ...stateTextColorMappings,
  ...stateBgColorMappings,
];
