import type { PluginCreator } from "postcss";
import { defaultConfig } from "./defaults";
import type { LynxCompatConfig } from "./types";

export type { LynxCompatConfig };

const PLUGIN_NAME = "postcss-lynx-compat";

function resolveClamp(value: string, strategy: "min" | "preferred" | "max"): string {
  let result = "";
  let i = 0;

  while (i < value.length) {
    const clampStart = value.indexOf("clamp(", i);
    if (clampStart === -1) {
      result += value.slice(i);
      break;
    }

    result += value.slice(i, clampStart);

    // 괄호 depth 추적으로 clamp() 인자 분리
    let depth = 1;
    let argStart = clampStart + 6; // "clamp(" 이후
    let j = argStart;
    const args: string[] = [];

    while (j < value.length && depth > 0) {
      if (value[j] === "(") depth++;
      else if (value[j] === ")") {
        depth--;
        if (depth === 0) {
          args.push(value.slice(argStart, j).trim());
          break;
        }
      } else if (value[j] === "," && depth === 1) {
        args.push(value.slice(argStart, j).trim());
        argStart = j + 1;
      }
      j++;
    }

    if (args.length === 3) {
      switch (strategy) {
        case "min":
          result += args[0];
          break;
        case "preferred":
          result += args[1];
          break;
        case "max":
          result += args[2];
          break;
      }
    } else {
      // 파싱 실패 시 원본 유지
      result += value.slice(clampStart, j + 1);
    }

    i = j + 1;
  }

  return result;
}

export const postcssLynxCompat: PluginCreator<LynxCompatConfig> = (opts = {}) => {
  const config = {
    remove: { ...defaultConfig.remove, ...opts.remove },
    transformSelectors: { ...defaultConfig.transformSelectors, ...opts.transformSelectors },
    removeAtRules: opts.removeAtRules ?? defaultConfig.removeAtRules,
    removeSelectors: opts.removeSelectors ?? defaultConfig.removeSelectors,
    suggestions: { ...defaultConfig.suggestions, ...opts.suggestions },
    supportedProperties: opts.supportedProperties ?? defaultConfig.supportedProperties,
    clampStrategy: opts.clampStrategy ?? defaultConfig.clampStrategy,
    warnOnly: opts.warnOnly ?? defaultConfig.warnOnly,
  };

  const supportedSet = new Set(config.supportedProperties);
  const removeMap = config.remove;
  const suggestionsMap = config.suggestions;

  // 셀렉터 변환용 정규식 (특수문자 이스케이프)
  const selectorEntries = Object.entries(config.transformSelectors).map(([from, to]) => ({
    pattern: new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    replacement: to,
  }));

  return {
    postcssPlugin: PLUGIN_NAME,

    // Phase 1: @media 규칙 제거
    AtRule(atRule) {
      if (atRule.name !== "media") return;

      for (const pattern of config.removeAtRules) {
        if (atRule.params.includes(pattern)) {
          atRule.remove();
          return;
        }
      }
    },

    // Phase 2: 룰 셀렉터 변환 & 제거
    Rule(rule) {
      // removeSelectors 패턴 매칭 → 룰 전체 제거
      for (const pattern of config.removeSelectors) {
        if (rule.selector.includes(pattern)) {
          rule.remove();
          return;
        }
      }

      // transformSelectors 매칭 → 셀렉터 치환
      let transformed = rule.selector;
      for (const { pattern, replacement } of selectorEntries) {
        transformed = transformed.replace(pattern, replacement);
      }
      if (transformed !== rule.selector) {
        rule.selector = transformed;
      }
    },

    // Phase 3: 프로퍼티 & 값 처리
    Declaration(decl) {
      const prop = decl.prop;

      // CSS custom property (--*) → 항상 통과, 값만 clamp 처리
      if (prop.startsWith("--")) {
        if (decl.value.includes("clamp(")) {
          decl.value = resolveClamp(decl.value, config.clampStrategy);
        }
        return;
      }

      // clamp() 값 변환 (일반 프로퍼티)
      if (decl.value.includes("clamp(")) {
        decl.value = resolveClamp(decl.value, config.clampStrategy);
      }

      // remove 목록에 등록 → 제거
      if (prop in removeMap) {
        decl.remove();
        return;
      }

      // suggestions 목록에 등록 → 빌드 에러 + 대안 메시지
      if (prop in suggestionsMap) {
        const suggestion = suggestionsMap[prop];
        const message = `Lynx에서 "${prop}"은 지원되지 않습니다. ${suggestion}`;
        if (config.warnOnly) {
          console.warn(`[postcss-lynx-compat] ${message}`);
          return;
        }
        throw decl.error(message, {
          plugin: PLUGIN_NAME,
        });
      }

      // supportedProperties에 등록 → 통과
      if (supportedSet.has(prop)) {
        return;
      }

      // 미등록 프로퍼티 → 에러 또는 경고
      const message =
        `"${prop}"은(는) Lynx 호환 설정에 등록되지 않았습니다. ` +
        "remove, suggestions, 또는 supportedProperties에 추가해주세요.";

      if (config.warnOnly) {
        console.warn(`[postcss-lynx-compat] ${message}`);
        return;
      }

      throw decl.error(message, { plugin: PLUGIN_NAME });
    },
  };
};

postcssLynxCompat.postcss = true;
