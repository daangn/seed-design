// This code includes portions derived from reshaped (https://github.com/reshaped-ui/reshaped)
// Used under the MIT License: https://opensource.org/licenses/MIT

import type { Container, Document, PluginCreator, Rule as PostCSSRule } from "postcss";

function isRule(node: Container | Document): node is PostCSSRule {
  return node.type === "rule";
}

export interface BreakpointConfig {
  name: string;
  minWidth: number;
}

export interface PluginOptions {
  /**
   * Suffix marker on CSS custom property names that triggers cascade chain generation.
   * @default "--responsive"
   */
  marker?: string;

  /**
   * Breakpoint definitions sorted by minWidth ascending.
   * Must include exactly one base breakpoint with minWidth 0.
   */
  breakpoints: BreakpointConfig[];
}

const PLUGIN_NAME = "postcss-responsive";

export const postcssResponsive: PluginCreator<PluginOptions> = (opts) => {
  if (!opts) {
    throw new Error(`${PLUGIN_NAME}: options with breakpoints are required`);
  }

  const marker = opts.marker ?? "--responsive";
  const sorted = [...opts.breakpoints].sort((a, b) => a.minWidth - b.minWidth);
  const base = sorted.find((bp) => bp.minWidth === 0);

  if (!base) {
    throw new Error(`${PLUGIN_NAME}: a base breakpoint with minWidth 0 is required`);
  }

  const mqBreakpoints = sorted.filter((bp) => bp.minWidth > 0);

  return {
    postcssPlugin: PLUGIN_NAME,

    Once(root, { Declaration, Rule, AtRule }) {
      // Group media query declarations by breakpoint, preserving selector order
      const mqRules: Record<string, Array<{ selector: string; prop: string; value: string }>> = {};
      for (const bp of mqBreakpoints) {
        mqRules[bp.name] = [];
      }

      root.walkDecls((decl) => {
        if (!decl.prop.endsWith(marker)) return;

        const parent = decl.parent;
        if (!parent || !isRule(parent)) return;

        const selector = parent.selector;
        const baseProp = decl.prop.slice(0, -marker.length);
        const defaultValue = decl.value;

        // Build cascade chain: each breakpoint variable falls back to the previous
        // --prop-base: defaultValue
        // --prop-sm: var(--prop-base)
        // --prop-md: var(--prop-sm)
        // --prop-lg: var(--prop-md)
        // --prop-xl: var(--prop-lg)
        // --prop: var(--prop-base)
        decl.before(
          new Declaration({
            prop: `${baseProp}-${base.name}`,
            value: defaultValue,
          }),
        );

        let prevName = base.name;
        for (const bp of mqBreakpoints) {
          decl.before(
            new Declaration({
              prop: `${baseProp}-${bp.name}`,
              value: `var(${baseProp}-${prevName})`,
            }),
          );
          prevName = bp.name;
        }

        decl.before(
          new Declaration({
            prop: baseProp,
            value: `var(${baseProp}-${base.name})`,
          }),
        );

        decl.remove();

        // Collect media query overrides: at each breakpoint, resolve to that breakpoint's var
        for (const bp of mqBreakpoints) {
          mqRules[bp.name]!.push({
            selector,
            prop: baseProp,
            value: `var(${baseProp}-${bp.name})`,
          });
        }
      });

      // Append @media blocks at the end of the stylesheet
      // Group declarations by selector within each media query
      for (const bp of mqBreakpoints) {
        const entries = mqRules[bp.name]!;
        if (entries.length === 0) continue;

        const mediaRule = new AtRule({
          name: "media",
          params: `(min-width: ${bp.minWidth}px)`,
        });

        // Group by selector to produce one rule per selector per media query
        const bySelector = new Map<string, Array<{ prop: string; value: string }>>();
        for (const entry of entries) {
          if (!bySelector.has(entry.selector)) {
            bySelector.set(entry.selector, []);
          }
          bySelector.get(entry.selector)!.push({ prop: entry.prop, value: entry.value });
        }

        for (const [selector, decls] of bySelector) {
          const rule = new Rule({ selector });
          for (const d of decls) {
            rule.append(new Declaration({ prop: d.prop, value: d.value }));
          }
          mediaRule.append(rule);
        }

        root.append(mediaRule);
      }
    },
  };
};

postcssResponsive.postcss = true;
