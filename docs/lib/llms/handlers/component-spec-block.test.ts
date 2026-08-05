import { describe, expect, it } from "bun:test";
import { remarkLLMs } from "fumadocs-core/mdx-plugins/remark-llms";
import type { Root } from "mdast";
import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { llmsHandlerOptions, tidyLLMMarkdown } from "../options";
import type { JsxNode, LLMHandler, RenderContext } from "../types";
import { componentSpecBlockHandler } from "./component-spec-block";

const isJsx = (node: { type: string }): node is JsxNode =>
  node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

/**
 * `renderLLMMarkdown` resolves handlers through the registry, which does not carry this
 * one yet. Same plugin order, same `RenderContext` as `options.ts` builds, one handler in
 * place of the lookup — swap it for `renderLLMMarkdown` once the handler is registered.
 */
async function renderWithHandler(handler: LLMHandler, mdx: string): Promise<string> {
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

const render = (mdx: string) => renderWithHandler(componentSpecBlockHandler, mdx);

describe("componentSpecBlock handler", () => {
  it("replaces the spec block with the rootage JSON url", async () => {
    const actual = await render('# Control Chip\n\n<ComponentSpecBlock id="control-chip" />');

    expect(actual).toBe(
      "# Control Chip\n\nComponent spec (JSON): /rootage/components/control-chip.json",
    );
  });

  it("ignores every prop but id", async () => {
    const actual = await render(
      '<ComponentSpecBlock\n  id="typography"\n  headingComponent="h4"\n  variants={["textStyle=screenTitle"]}\n/>',
    );

    expect(actual).toBe("Component spec (JSON): /rootage/components/typography.json");
  });

  it("keeps the tag for an id with no spec behind it", async () => {
    const actual = await render('# Unknown\n\n<ComponentSpecBlock id="does-not-exist" />');

    expect(actual).toBe('# Unknown\n\n<ComponentSpecBlock id="does-not-exist" />');
  });

  it("keeps the tag when id is missing", async () => {
    expect(await render("<ComponentSpecBlock />")).toBe("<ComponentSpecBlock />");
  });

  // The kept tag is fumadocs' own rewrite of the source, which flattens an expression
  // attribute into a string one — `id={componentId}` comes back quoted.
  it("keeps the tag when id is an expression rather than a string", async () => {
    expect(await render("<ComponentSpecBlock id={componentId} />")).toBe(
      '<ComponentSpecBlock id="componentId" />',
    );
  });

  it("leaves the url unescaped", async () => {
    expect(await render('<ComponentSpecBlock id="action-button" />')).toBe(
      "Component spec (JSON): /rootage/components/action-button.json",
    );
  });

  it("leaves other JSX alone", async () => {
    expect(await render("<Callout>유지됩니다</Callout>")).toContain("<Callout>");
  });
});
