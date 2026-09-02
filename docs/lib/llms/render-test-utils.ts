import { remarkLLMs } from "fumadocs-core/mdx-plugins/remark-llms";
import type { Root } from "mdast";
import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { llmsHandlerOptions, removeForLLMs, tidyLLMMarkdown } from "./options";
import type { JsxNode, LLMHandler, RenderContext } from "./types";

/**
 * The unified stand-in for the `_stringify` hint `remarkApplyLlmsFilter` writes in
 * `app/source.tsx`. Both call `removeForLLMs`; only the host API differs.
 */
export function remarkLLMRemovals() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (!removeForLLMs(node)) return;
      node.data = { ...node.data, _stringify: { text: "" } };
    });
  };
}

/**
 * Runs MDX through the same plugin order the site uses — removals first, then the llms
 * stringifier — and returns what a page's `processed` export would hold.
 *
 * Handler tests should go through this rather than calling `render` directly: most of
 * what can go wrong lives in the seam (a `render` returning `""` silently falls back to
 * the raw JSX, a `remove` that never fires leaves the tag in place), and calling the
 * handler in isolation reports success for both.
 */
export async function renderLLMMarkdown(mdx: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkLLMRemovals)
    .use(remarkLLMs, { ...llmsHandlerOptions, _data: true });

  const tree = processor.parse(mdx) as Root;
  const file = { data: {} } as never;
  await processor.run(tree, file);

  return tidyLLMMarkdown(String((file as { data: { markdown?: string } }).data.markdown ?? ""));
}

const isJsx = (node: { type: string }): node is JsxNode =>
  node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

/**
 * Same plugin order and the same `RenderContext` as `options.ts` builds, with one handler
 * in place of the registry lookup. For a handler the registry cannot reach as written —
 * one built from injected data, or one not registered yet.
 */
export async function renderWithHandler(handler: LLMHandler, mdx: string): Promise<string> {
  const owned = (node: { type: string }) =>
    isJsx(node) && node.name && handler.names.includes(node.name) ? node : undefined;

  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(() => (tree: Root) => {
      visit(tree, (node) => {
        const jsx = owned(node);
        if (!jsx || !handler.remove?.(jsx)) return;

        jsx.data = { ...jsx.data, _stringify: { text: "" } };
      });
    })
    .use(remarkLLMs, {
      ...llmsHandlerOptions,
      _data: true,
      stringify(node, _parent, state, info) {
        const jsx = owned(node);
        if (!jsx || !handler.render) return undefined;

        const ctx: RenderContext = {
          phrasing: () => state.containerPhrasing(jsx, info),
          flow: () =>
            jsx.type === "mdxJsxFlowElement"
              ? state.containerFlow(jsx, info)
              : state.containerPhrasing(jsx, info),
          attr: (name) => {
            const found = jsx.attributes.find(
              (attribute): attribute is MdxJsxAttribute =>
                attribute.type === "mdxJsxAttribute" && attribute.name === name,
            );
            return typeof found?.value === "string" ? found.value : undefined;
          },
          state,
          info,
        };

        return handler.render(jsx, ctx);
      },
    });

  const tree = processor.parse(mdx) as Root;
  const file = { data: {} } as never;
  await processor.run(tree, file);

  return tidyLLMMarkdown(String((file as { data: { markdown?: string } }).data.markdown ?? ""));
}
