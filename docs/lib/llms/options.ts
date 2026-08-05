import type { LLMsOptions } from "@fumadocs/satteri/remark-llms";
import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import { handlers } from "./registry";
import type { JsxNode, LLMHandler, RenderContext } from "./types";

export type { JsxNode, LLMHandler, RenderContext } from "./types";

const byName = new Map<string, LLMHandler>();
for (const handler of handlers) {
  for (const name of handler.names) {
    const existing = byName.get(name);
    if (existing) throw new Error(`Two llms handlers claim <${name}>`);
    byName.set(name, handler);
  }
}

const isJsx = (node: { type: string }): node is JsxNode =>
  node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

function handlerFor(node: { type: string }): LLMHandler | undefined {
  if (!isJsx(node) || !node.name) return undefined;
  return byName.get(node.name);
}

/**
 * Whether a handler wants the node gone.
 *
 * Removal cannot be expressed by `stringify` returning `""`: `defaultStringifier` tests
 * that return value for truthiness and falls through to its default handling. It has to
 * be decided before stringifying, which is what `filterElement` is for — the host marks
 * the node with a `_stringify` hint on the way in.
 *
 * The hosts differ, so each supplies its own three-line adapter around this predicate:
 * `app/source.tsx` folds it into the filter `remarkApplyLlmsFilter` already applies, and
 * `render-test-utils.ts` writes the same hint from a plain unified plugin.
 */
export function removeForLLMs(node: { type: string }): boolean {
  const handler = handlerFor(node);
  return Boolean(handler?.remove && isJsx(node) && handler.remove(node));
}

/**
 * Spread into the `remarkLlms` call in `app/source.tsx`, which owns the options the whole
 * docs site shares. Note that `filterElement` is not settable here — `remarkLlms` spreads
 * these options and then overwrites that one field with its own.
 */
export const llmsHandlerOptions: LLMsOptions = {
  // `remarkLLMs` stringifies with mdast-util-to-markdown defaults, which use `*`.
  // The rest of the docs pipeline writes `-`, so pin it rather than let the two drift.
  bullet: "-",
  stringify(node, _parent, state, info) {
    const handler = handlerFor(node);
    if (!handler?.render || !isJsx(node)) return undefined;

    const ctx: RenderContext = {
      phrasing: () => state.containerPhrasing(node, info),
      // An inline element has no block children to lay out, so asking for flow on one is
      // a caller slip rather than a case to support — serialize it inline and move on.
      flow: () =>
        node.type === "mdxJsxFlowElement"
          ? state.containerFlow(node, info)
          : state.containerPhrasing(node, info),
      attr: (name) => {
        const found = node.attributes.find(
          (attribute): attribute is MdxJsxAttribute =>
            attribute.type === "mdxJsxAttribute" && attribute.name === name,
        );
        return typeof found?.value === "string" ? found.value : undefined;
      },
      state,
      info,
    };

    return handler.render(node, ctx);
  },
};

/** Collapses the blank runs a removed node leaves behind. */
export function tidyLLMMarkdown(markdown: string): string {
  return markdown.replace(/\n{3,}/g, "\n\n").trim();
}
