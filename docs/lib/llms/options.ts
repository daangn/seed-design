import type { LLMsOptions } from "@fumadocs/satteri/remark-llms";
import { placeholder } from "fumadocs-core/mdx-plugins/remark-llms";
import {
  type PlaceholderData,
  renderPlaceholder,
} from "fumadocs-core/mdx-plugins/remark-llms.runtime";
import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import { handlers, placeholders } from "./registry";
import type { JsxNode, LLMHandler, LLMPlaceholder, RenderContext } from "./types";

export type { JsxNode, LLMHandler, RenderContext } from "./types";

const byName = new Map<string, LLMHandler>();
for (const handler of handlers) {
  for (const name of handler.names) {
    const existing = byName.get(name);
    if (existing) throw new Error(`Two llms handlers claim <${name}>`);
    byName.set(name, handler);
  }
}

const placeholderByName = new Map<string, LLMPlaceholder>();
for (const entry of placeholders) {
  for (const name of entry.names) {
    const existing = placeholderByName.get(name);
    if (existing) throw new Error(`Two llms placeholders claim <${name}>`);
    if (byName.has(name))
      throw new Error(`<${name}> is claimed by both a handler and a placeholder`);
    placeholderByName.set(name, entry);
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
  // `remarkLlms` stringifies with mdast-util-to-markdown defaults, which use `*`.
  // The rest of the docs pipeline writes `-`, so pin it rather than let the two drift.
  bullet: "-",
  stringify(node, parent, state, info) {
    // Written out here rather than through `mdxAsPlaceholder`, which only
    // `fumadocs-core`'s own `remarkLLMs` reads — Satteri's wrapper forwards `stringify`
    // untouched and drops that option, so relying on it would fail silently in the app
    // while still passing the tests, which go through the core plugin.
    if (isJsx(node) && node.name && placeholderByName.has(node.name)) {
      return placeholder(node, parent, state, info);
    }

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

/** Rebuilds the source tag, for a placeholder that could not produce a replacement. */
function originalTag({ name, attributes, children }: PlaceholderData): string {
  const rendered = Object.entries(attributes)
    .map(([key, value]) => (typeof value === "string" ? ` ${key}="${value}"` : ` ${key}`))
    .join("");

  return children ? `<${name}${rendered}>${children}</${name}>` : `<${name}${rendered} />`;
}

/**
 * Fills in the markers `stringify` left behind. Runs when a page is read, which is the
 * first point in the pipeline that can await, and must be applied to every path that
 * serves processed markdown — an unrendered marker reaches the reader as a NUL-wrapped
 * JSON blob.
 */
export function renderLLMPlaceholders(markdown: string): Promise<string> {
  const renderers = Object.fromEntries(
    [...placeholderByName].map(([name, entry]) => [
      name,
      async (data: PlaceholderData) => (await entry.render(data)) ?? originalTag(data),
    ]),
  );

  return renderPlaceholder(markdown, renderers);
}
