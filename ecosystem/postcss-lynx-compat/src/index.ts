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

// ── :is() 셀렉터 확장 ──

/**
 * transition shorthand 값에서 미지원 프로퍼티 항목 제거.
 * 각 entry의 첫 토큰(property name)이 removeMap에 있으면 필터링.
 */
function filterTransitionValue(value: string, removeMap: Record<string, string>): string | null {
  const entries = splitByComma(value);
  const filtered = entries.filter((entry) => {
    const propName = entry.trim().split(/\s+/)[0];
    return !(propName in removeMap);
  });
  return filtered.length === 0 ? null : filtered.join(", ");
}

/**
 * transition-property 값에서 미지원 프로퍼티 이름 제거.
 */
function filterTransitionPropertyValue(
  value: string,
  removeMap: Record<string, string>,
): string | null {
  const props = splitByComma(value);
  const filtered = props.filter((p) => !(p.trim() in removeMap));
  return filtered.length === 0 ? null : filtered.join(", ");
}

/** 괄호/대괄호 depth를 존중하면서 콤마로 분리 */
function splitByComma(str: string): string[] {
  const items: string[] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    else if (ch === "," && depth === 0) {
      items.push(str.slice(start, i).trim());
      start = i + 1;
    }
  }
  items.push(str.slice(start).trim());
  return items;
}

/** openIndex 위치의 '(' 에 대응하는 ')' 인덱스를 반환 */
function findMatchingParen(str: string, openIndex: number): number {
  let depth = 1;
  for (let i = openIndex + 1; i < str.length; i++) {
    if (str[i] === "(") depth++;
    if (str[i] === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * 단일 셀렉터에서 :is() / :not(:is()) 를 확장한다.
 *
 * .foo:is(a, b)suffix → [.fooa+suffix, .foob+suffix]
 * .foo:not(:is(a, b))suffix → [.foo:not(a):not(b)+suffix]
 */
function expandSingleSelector(selector: string): string[] {
  // 1) :not(:is(...)) → :not(a):not(b)
  const notIsIdx = selector.indexOf(":not(:is(");
  if (notIsIdx !== -1) {
    const isOpenParen = notIsIdx + 8; // ':not(:is(' → '(' 위치
    const isCloseParen = findMatchingParen(selector, isOpenParen);
    if (isCloseParen === -1) return [selector];

    const inner = selector.slice(isOpenParen + 1, isCloseParen);
    const args = splitByComma(inner);

    const prefix = selector.slice(0, notIsIdx);
    // :not(:is(...))  →  isCloseParen 은 :is 의 ), 다음 ) 는 :not 의 )
    const notCloseParen = isCloseParen + 1;
    const suffix = selector.slice(notCloseParen + 1);

    const notChain = args.map((a) => `:not(${a})`).join("");
    const expanded = prefix + notChain + suffix;

    // 재귀: 추가 :is() 가 남아있을 수 있음
    return expandSingleSelector(expanded);
  }

  // 2) :is(...) → 개별 셀렉터로 확장
  const isIdx = selector.indexOf(":is(");
  if (isIdx === -1) return [selector];

  const openParen = isIdx + 3; // '(' 위치
  const closeParen = findMatchingParen(selector, openParen);
  if (closeParen === -1) return [selector];

  const prefix = selector.slice(0, isIdx);
  const inner = selector.slice(openParen + 1, closeParen);
  const suffix = selector.slice(closeParen + 1);

  const args = splitByComma(inner);

  const results: string[] = [];
  for (const arg of args) {
    const expanded = prefix + arg + suffix;
    // 재귀: 추가 :is() 가 남아있을 수 있음
    results.push(...expandSingleSelector(expanded));
  }

  return results;
}

/**
 * 전체 셀렉터 (콤마 구분 포함) 에서 :is() 를 확장한다.
 * 콤마 구분된 각 개별 셀렉터에 대해 확장 후 합친다.
 */
function expandIsSelectors(fullSelector: string): string {
  const selectors = splitByComma(fullSelector);
  const expanded: string[] = [];

  for (const sel of selectors) {
    expanded.push(...expandSingleSelector(sel));
  }

  return expanded.join(", ");
}

/**
 * 셀렉터의 base class 부분에 text slot 접미사를 삽입한다.
 * .seed-action-button → .seed-action-button__text
 * .seed-action-button--variant_brandSolid → .seed-action-button__text--variant_brandSolid
 * .seed-X--a_1.seed-X--b_2 → .seed-X__text--a_1.seed-X__text--b_2
 */
function insertTextSlotSuffix(selector: string, suffix: string): string {
  // 각 셀렉터 부분을 개별 처리 (콤마 분리)
  return selector
    .split(",")
    .map((s) => s.trim())
    .map((singleSelector) => {
      // 복합 셀렉터: .seed-X--a_1.seed-X--b_2 → 각 클래스 개별 처리
      // name: 단일 하이픈으로 연결된 컴포넌트명 (action-button), -- 이전까지
      return singleSelector.replace(
        /\.seed-([a-z0-9]+(?:-[a-z0-9]+)*)(--[^\s.,[]*)?/gi,
        (_, name, modifier) => {
          if (modifier) {
            return `.seed-${name}${suffix}${modifier}`;
          }
          return `.seed-${name}${suffix}`;
        },
      );
    })
    .join(", ");
}

export const postcssLynxCompat: PluginCreator<LynxCompatConfig> = (opts = {}) => {
  const config = {
    remove: { ...defaultConfig.remove, ...opts.remove },
    transformSelectors: { ...defaultConfig.transformSelectors, ...opts.transformSelectors },
    removeAtRules: opts.removeAtRules ?? defaultConfig.removeAtRules,
    removeSelectors: opts.removeSelectors ?? defaultConfig.removeSelectors,
    filterPseudoClasses: opts.filterPseudoClasses ?? defaultConfig.filterPseudoClasses,
    suggestions: { ...defaultConfig.suggestions, ...opts.suggestions },
    supportedProperties: opts.supportedProperties ?? defaultConfig.supportedProperties,
    clampStrategy: opts.clampStrategy ?? defaultConfig.clampStrategy,
    warnOnly: opts.warnOnly ?? defaultConfig.warnOnly,
    expandShorthands: { ...defaultConfig.expandShorthands, ...opts.expandShorthands },
    textSlot: opts.textSlot ?? defaultConfig.textSlot,
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

      // :is() 확장 — Lynx CSS 파서가 :is() 미지원
      if (transformed.includes(":is(")) {
        transformed = expandIsSelectors(transformed);
      }

      // 미지원 pseudo-class 필터링 — 콤마 그룹에서 해당 셀렉터만 제거, data-* 대안 유지
      if (config.filterPseudoClasses.length > 0) {
        const selectors = splitByComma(transformed);
        const filtered = selectors.filter(
          (sel) => !config.filterPseudoClasses.some((pc) => sel.includes(pc)),
        );

        if (filtered.length === 0) {
          rule.remove();
          return;
        }
        transformed = filtered.join(", ");
      }

      if (transformed !== rule.selector) {
        rule.selector = transformed;
      }
    },

    // Phase 3–5 모두 OnceExit에서 처리 (postcss-nested 실행 후)
    OnceExit(root) {
      // Phase 3: 프로퍼티 & 값 처리
      root.walkDecls((decl) => {
        const prop = decl.prop;

        // CSS custom property (--*) → 항상 통과, 값만 clamp 처리
        if (prop.startsWith("--")) {
          if (decl.value.includes("clamp(")) {
            decl.value = resolveClamp(decl.value, config.clampStrategy);
          }
          return;
        }

        // vendor prefix (-webkit-*, -moz-*, -ms-*, -o-*) → Lynx 미지원이므로 제거
        if (
          prop.startsWith("-webkit-") ||
          prop.startsWith("-moz-") ||
          prop.startsWith("-ms-") ||
          prop.startsWith("-o-")
        ) {
          decl.remove();
          return;
        }

        // shorthand 확장 (inset 등)
        if (prop in config.expandShorthands) {
          const expanded = config.expandShorthands[prop](decl.value);
          for (const { prop: newProp, value: newValue } of expanded) {
            decl.before({ prop: newProp, value: newValue });
          }
          decl.remove();
          return;
        }

        // clamp() 값 변환 (일반 프로퍼티)
        if (decl.value.includes("clamp(")) {
          decl.value = resolveClamp(decl.value, config.clampStrategy);
        }

        // transition 값에서 미지원 프로퍼티 필터링
        if (prop === "transition") {
          const filtered = filterTransitionValue(decl.value, removeMap);
          if (filtered === null) {
            decl.remove();
            return;
          }
          decl.value = filtered;
        }
        if (prop === "transition-property") {
          const filtered = filterTransitionPropertyValue(decl.value, removeMap);
          if (filtered === null) {
            decl.remove();
            return;
          }
          decl.value = filtered;
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
      });

      // Phase 5: Text Slot Splitting — view/text CSS 프로퍼티 분리
      if (!config.textSlot) return;

      const { suffix, textProperties, sharedProperties } = config.textSlot;
      const textPropsSet = new Set(textProperties);
      const sharedPropsSet = new Set(sharedProperties);

      const rulesToProcess: import("postcss").Rule[] = [];
      root.walkRules((rule) => {
        rulesToProcess.push(rule);
      });

      for (const rule of rulesToProcess) {
        // SlotRecipe CSS는 이미 슬롯 분리됨 (셀렉터에 __ 포함) → 스킵
        if (rule.selector.includes("__")) continue;

        // seed- 클래스가 아닌 rule은 스킵
        if (!rule.selector.includes(".seed-")) continue;

        const textDecls: import("postcss").Declaration[] = [];
        const sharedDecls: import("postcss").Declaration[] = [];
        const viewOnlyDecls: import("postcss").Declaration[] = [];
        const cssVarDecls: import("postcss").Declaration[] = [];

        rule.walkDecls((decl) => {
          if (decl.prop.startsWith("--")) {
            cssVarDecls.push(decl);
          } else if (textPropsSet.has(decl.prop)) {
            textDecls.push(decl);
          } else if (sharedPropsSet.has(decl.prop)) {
            sharedDecls.push(decl);
          } else {
            viewOnlyDecls.push(decl);
          }
        });

        // text 전용 + shared declarations가 없으면 분리 불필요
        if (textDecls.length === 0 && sharedDecls.length === 0 && cssVarDecls.length === 0)
          continue;

        // text rule 생성
        const textSelector = insertTextSlotSuffix(rule.selector, suffix);
        const textRule = rule.cloneAfter({ selector: textSelector });
        textRule.removeAll();

        // text rule에 CSS vars + shared + text 전용 프로퍼티 추가
        for (const decl of cssVarDecls) {
          textRule.append(decl.clone());
        }
        for (const decl of sharedDecls) {
          textRule.append(decl.clone());
        }
        for (const decl of textDecls) {
          textRule.append(decl.clone());
        }

        // 원래 rule에서 text 전용 프로퍼티 제거 (CSS vars + shared + view-only 유지)
        for (const decl of textDecls) {
          decl.remove();
        }

        // view-only 프로퍼티만 남은 것이 없으면 원래 rule 제거
        if (viewOnlyDecls.length === 0 && sharedDecls.length === 0 && cssVarDecls.length === 0) {
          rule.remove();
        }
      }
    },
  };
};

postcssLynxCompat.postcss = true;
