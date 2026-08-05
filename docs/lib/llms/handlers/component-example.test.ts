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
import { componentExampleHandler } from "./component-example";

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

const render = (mdx: string) => renderWithHandler(componentExampleHandler, mdx);

const CODE = [
  "```tsx",
  'import { ActionButton } from "seed-design/ui/action-button";',
  "",
  "export default function ActionButtonPreview() {",
  "  return <ActionButton>라벨</ActionButton>;",
  "}",
  "```",
].join("\n");

const indented = (code: string) =>
  code
    .split("\n")
    .map((line) => (line ? `  ${line}` : line))
    .join("\n");

describe("componentExample handler", () => {
  it("adds a Preview heading when name ends with /preview", async () => {
    const actual = await render(
      `<ComponentExample name="react/action-button/preview">\n${indented(CODE)}\n</ComponentExample>`,
    );

    expect(actual).toBe(`## Preview\n\n${CODE}`);
  });

  it("unwraps a non-preview example without adding a heading", async () => {
    const actual = await render(
      `<ComponentExample name="react/action-button/brand-solid">\n${indented(CODE)}\n</ComponentExample>`,
    );

    expect(actual).toBe(CODE);
  });

  it("keeps the heading for a self-closing preview, which has no code to unwrap", async () => {
    expect(await render('<ComponentExample name="react/text/preview" />\n\n본문입니다.')).toBe(
      "## Preview\n\n본문입니다.",
    );
  });

  it("drops a self-closing non-preview example rather than leaving the tag", async () => {
    expect(await render('앞\n\n<ComponentExample name="react/text/usage" />\n\n뒤')).toBe(
      "앞\n\n뒤",
    );
  });

  it("unwraps without a heading when name is missing", async () => {
    expect(await render("<ComponentExample>\n  본문입니다.\n</ComponentExample>")).toBe(
      "본문입니다.",
    );
  });

  it("unwraps without a heading when name is an expression rather than a string", async () => {
    expect(
      await render("<ComponentExample name={preview}>\n  본문입니다.\n</ComponentExample>"),
    ).toBe("본문입니다.");
  });

  it("keeps the surrounding page around an unwrapped example", async () => {
    const actual = await render(
      `## 사용법\n\n<ComponentExample name="react/action-button/preview">\n${indented(CODE)}\n</ComponentExample>\n\n설명입니다.`,
    );

    expect(actual).toBe(`## 사용법\n\n## Preview\n\n${CODE}\n\n설명입니다.`);
  });

  it("keeps multiple children in order", async () => {
    const actual = await render(
      '<ComponentExample name="react/action-button/preview">\n  첫 문단.\n\n  둘째 문단.\n</ComponentExample>',
    );

    expect(actual).toBe("## Preview\n\n첫 문단.\n\n둘째 문단.");
  });

  it("leaves other JSX alone", async () => {
    expect(await render("<Callout>유지됩니다</Callout>")).toContain("<Callout>");
  });

  it("treats a Lynx example the same as a React one", async () => {
    const actual = await render(
      '<LynxComponentExample name="lynx/action-button/preview">\n\n```tsx\nconst a = 1;\n```\n\n</LynxComponentExample>',
    );

    expect(actual).toContain("## Preview");
    expect(actual).toContain("const a = 1;");
    expect(actual).not.toContain("LynxComponentExample");
  });
});
