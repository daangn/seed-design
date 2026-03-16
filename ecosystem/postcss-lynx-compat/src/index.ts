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

/**
 * env() 함수에서 fallback 인자를 제거한다.
 * Lynx는 env(name, fallback) 구문을 지원하지 않으므로 env(name)만 남긴다.
 * 예: env(safe-area-inset-top, 0px) → env(safe-area-inset-top)
 */
function stripEnvFallbacks(value: string): string {
  let result = "";
  let i = 0;

  while (i < value.length) {
    const envStart = value.indexOf("env(", i);
    if (envStart === -1) {
      result += value.slice(i);
      break;
    }

    result += value.slice(i, envStart);

    // 괄호 depth 추적으로 env() 인자 분리
    let depth = 1;
    const argStart = envStart + 4; // "env(" 이후
    let j = argStart;
    let firstComma = -1;

    while (j < value.length && depth > 0) {
      if (value[j] === "(") depth++;
      else if (value[j] === ")") {
        depth--;
        if (depth === 0) break;
      } else if (value[j] === "," && depth === 1 && firstComma === -1) {
        firstComma = j;
      }
      j++;
    }

    if (firstComma !== -1) {
      // fallback이 있으면 첫 번째 인자만 남김
      const name = value.slice(argStart, firstComma).trim();
      result += `env(${name})`;
    } else {
      // fallback이 없으면 원본 유지
      result += value.slice(envStart, j + 1);
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

/** page/:root 관련 셀렉터인지 판별 */
function isPageSelector(s: string): boolean {
  return (
    s === "page" ||
    s.startsWith("page[") ||
    s.startsWith("page.") ||
    s.startsWith("page ") ||
    s === ":root" ||
    s.startsWith(":root[") ||
    s.startsWith(":root.") ||
    s.startsWith(":root ")
  );
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
    selectorMappings: opts.selectorMappings ?? defaultConfig.selectorMappings,
    unwrapSupports: opts.unwrapSupports ?? defaultConfig.unwrapSupports,
    replaceVarWithEnv: opts.replaceVarWithEnv ?? defaultConfig.replaceVarWithEnv,
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

    // Rule/AtRule 훅: 셀렉터 변환, pseudo-class 필터링, @media 제거
    AtRule(atRule) {
      // @media 규칙 제거
      if (atRule.name === "media") {
        for (const pattern of config.removeAtRules) {
          if (atRule.params.includes(pattern)) {
            atRule.remove();
            return;
          }
        }
      }

      // @supports 규칙 처리 (unwrap 또는 remove)
      if (atRule.name === "supports") {
        for (const rule of config.unwrapSupports) {
          if (atRule.params.includes(rule.condition)) {
            if (rule.action === "remove") {
              atRule.remove();
            } else if (rule.action === "unwrap") {
              atRule.replaceWith(atRule.nodes);
            }
            return;
          }
        }
      }
    },

    // 룰 셀렉터 변환 & 제거
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

    // OnceExit: postcss-nested 실행 후 일괄 처리
    OnceExit(root) {
      // Step 1: var() → env() 직접 치환 (safe-area 등)
      if (config.replaceVarWithEnv.length > 0) {
        const varNameSet = new Set(config.replaceVarWithEnv.map((r) => r.varName));

        // A: 모든 선언에서 var(--name) → env(envName, fallback) 치환
        root.walkDecls((decl) => {
          if (!decl.value.includes("var(")) return;
          let value = decl.value;
          let changed = false;

          for (const { varName, envName, fallback } of config.replaceVarWithEnv) {
            let searchFrom = 0;
            while (true) {
              const varIdx = value.indexOf(`var(${varName}`, searchFrom);
              if (varIdx === -1) break;

              const openParen = varIdx + 3; // 'var(' の '(' 位置
              const closeParen = findMatchingParen(value, openParen);
              if (closeParen === -1) break;

              // var(--name) or var(--name, fallback) 전체를 env()로 치환
              const envValue = fallback ? `env(${envName}, ${fallback})` : `env(${envName})`;
              value = value.slice(0, varIdx) + envValue + value.slice(closeParen + 1);
              changed = true;
              searchFrom = varIdx + envValue.length;
            }
          }

          if (changed) decl.value = value;
        });

        // B: :root/page 셀렉터에서 매핑된 커스텀 프로퍼티 정의 제거
        root.walkRules((rule) => {
          if (!rule.selectors.some(isPageSelector)) return;
          rule.walkDecls(/^--/, (decl) => {
            if (varNameSet.has(decl.prop)) decl.remove();
          });
        });

        // C: 빈 룰 제거
        root.walkRules((rule) => {
          if (rule.nodes && rule.nodes.length === 0) rule.remove();
        });
      }

      // Step 1.6: env() fallback 제거 — Lynx는 env(name, fallback) 미지원
      root.walkDecls((decl) => {
        if (!decl.value.includes("env(")) return;
        const stripped = stripEnvFallbacks(decl.value);
        if (stripped !== decl.value) decl.value = stripped;
      });

      // Step 2: selectorMappings — data-attr → class 변환
      if (config.selectorMappings.length > 0) {
        root.walkRules((rule) => {
          if (!rule.selector.includes("[data-")) return;

          const selectors = splitByComma(rule.selector);
          const transformed = selectors.map((sel) => {
            let result = sel;
            for (const { match, replace } of config.selectorMappings) {
              if (!result.includes(match)) continue;

              // [data-*] attribute selector 중 match를 포함하는 것을 제거
              result = result.replace(/\[[^\]]*\]/g, (bracket) =>
                bracket.includes(match) ? "" : bracket,
              );

              // descendant selector 패턴 처리: "page " 뒤의 빈 selector 정리
              // 예: "page [data-seed-color-mode="dark-only"]" → "page" → "page.class"
              result = result.replace(/\s+/g, " ").trim();

              // class selector 추가
              if (!result.includes(replace)) {
                // descendant 구분자가 있으면 마지막 요소에 추가
                const parts = result.split(/\s+/);
                if (parts.length > 1 && parts[parts.length - 1] === "") {
                  // trailing space 제거 후 첫 번째 요소에 추가
                  result = parts.filter(Boolean).join(" ");
                }
                result = result + replace;
              }
            }
            return result;
          });

          const unique = [...new Set(transformed)];
          const nonEmpty = unique.filter((s) => s.length > 0);

          if (nonEmpty.length === 0) {
            rule.remove();
            return;
          }
          rule.selector = nonEmpty.join(", ");
        });
      }

      // Step 3: [data-X] 속성 셀렉터 → variant 클래스 변환
      root.walkRules((rule) => {
        if (!rule.selector.includes("[data-")) return;

        const selectors = splitByComma(rule.selector);
        const transformed = selectors.map((sel) => {
          return sel.replace(
            /(\.[a-zA-Z0-9_-]+)((?:--[^\s.,[\]]*)?)\[data-([a-zA-Z0-9_-]+)(?:="([^"]*)")?\]/g,
            (_, baseClass, modifier, attrName, attrValue) => {
              const value = attrValue ?? "true";
              // base class에서 컴포넌트명 추출 (예: .seed-action-button__text → seed-action-button__text)
              const className = baseClass.slice(1); // '.' 제거
              // 컴포넌트 base name 추출 (-- 이전 부분)
              const baseName = className.replace(/--.*$/, "");
              return `${baseClass}${modifier}.${baseName}--${attrName}_${value}`;
            },
          );
        });

        rule.selector = transformed.join(", ");
      });

      // Step 4: 프로퍼티 필터링 + transition 정리
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

      // Step 5: Text Slot 분리 — view/text CSS 프로퍼티 분리
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

        // 테마 셀렉터만 포함된 룰은 text slot 분리 불필요
        // .seed-color-mode-dark-only, :root.seed-color-mode-light-only 등은 토큰 변수만 정의하므로 스킵
        // .seed-action-button.seed-color-mode-dark-only 같은 경우는 컴포넌트 스타일이므로 처리
        if (
          rule.selector.includes(".seed-color-mode-") &&
          !rule.selector.match(/\.seed-(?!color-mode-)[a-z]/)
        )
          continue;

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

      // Step 6: 빈 룰 제거 — 모든 변환 후 남은 빈 블록 정리
      root.walkRules((rule) => {
        if (rule.nodes && rule.nodes.length === 0) rule.remove();
      });
    },
  };
};

postcssLynxCompat.postcss = true;
