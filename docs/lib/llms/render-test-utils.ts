import { compileMdx } from "@fumadocs/satteri/compile";
import { remarkLlms } from "@fumadocs/satteri/remark-llms";
import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import { defaultHandlers } from "mdast-util-to-markdown";
import { preserveRuleElements } from "@/app/_llms/rule-elements";
import { type FilterElement, remarkApplyLlmsFilter } from "@/lib/satteri/remark-llms-filter";
import { filterStructureElement, structureStringify } from "@/lib/satteri/search-structure";
import { llmsHandlerOptions, removeForLLMs, tidyLLMMarkdown, withChildren } from "./options";
import type { JsxNode, LLMHandler, RenderContext } from "./types";

type Stringify = NonNullable<Parameters<typeof remarkLlms>[0]>["stringify"];

/**
 * Compiles through Satteri with the options `app/source.tsx` sets, because the parser is
 * not an implementation detail these tests can abstract over.
 *
 * Satteri leaves `children` off a self-closing element while remark writes `[]`, so a
 * harness built on remark reports success for a `remove` predicate that throws on every
 * page carrying a self-closing tag. That gap shipped once: 381 passing tests over a docs
 * build that could not render a single page.
 */
async function compileToLLMMarkdown(
  mdx: string,
  filterElement: FilterElement,
  stringify?: Stringify,
): Promise<string> {
  const result = await compileMdx({
    source: mdx,
    filePath: "/tmp/render-test.mdx",
    options: {
      mdastPlugins: [
        remarkApplyLlmsFilter(filterElement),
        remarkLlms({
          ...llmsHandlerOptions,
          as: "processed",
          handlers: { heading: defaultHandlers.heading },
          headingIds: false,
          filterElement,
          filterMdxAttributes: structureStringify.filterMdxAttributes,
          ...(stringify ? { stringify } : {}),
        }),
      ],
    },
  });

  return tidyLLMMarkdown(result.data.markdown ?? "");
}

const isJsx = (node: { type: string }): node is JsxNode =>
  node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

/**
 * Runs MDX through the same plugin order, filter and options the site uses, and returns
 * what a page's `processed` export would hold.
 *
 * Handler tests should go through this rather than calling `render` directly: most of
 * what can go wrong lives in the seam (a `render` returning `""` silently falls back to
 * the raw JSX, a `remove` that never fires leaves the tag in place), and calling the
 * handler in isolation reports success for both.
 */
export async function renderLLMMarkdown(mdx: string): Promise<string> {
  return compileToLLMMarkdown(mdx, filterLlmsElement);
}

/** The filter `app/source.tsx` assembles, so the harness removes what the site removes. */
const filterLlmsElement: FilterElement = (node) =>
  removeForLLMs(node) ? false : preserveRuleElements(filterStructureElement)(node);

/**
 * Same pipeline and the same `RenderContext` as `options.ts` builds, with one handler in
 * place of the registry lookup. For a handler the registry cannot reach as written — one
 * built from injected data, or one not registered yet.
 */
export async function renderWithHandler(handler: LLMHandler, mdx: string): Promise<string> {
  const owned = (node: { type: string }) =>
    isJsx(node) && node.name && handler.names.includes(node.name) ? node : undefined;

  // Only this handler's tags are judged. Everything else stays put, so a test can assert
  // that unrelated JSX survives without the site's own structure filter weighing in.
  const filterElement: FilterElement = (node) => {
    const jsx = owned(node);
    return jsx ? !handler.remove?.(withChildren(jsx)) : true;
  };

  const stringify: Stringify = (node, _parent, state, info) => {
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
  };

  return compileToLLMMarkdown(mdx, filterElement, stringify);
}
