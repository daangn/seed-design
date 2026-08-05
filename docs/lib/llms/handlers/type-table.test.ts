import { describe, expect, it } from "bun:test";
import { remarkLLMs } from "fumadocs-core/mdx-plugins/remark-llms";
import type { DocEntry, GeneratedDoc } from "fumadocs-typescript";
import type { Root } from "mdast";
import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { llmsHandlerOptions, tidyLLMMarkdown } from "../options";
import { remarkLLMRemovals } from "../render-test-utils";
import { typeTableHandler } from "./type-table";

/**
 * `renderLLMMarkdown` with this handler patched in: the registry does not carry it yet,
 * so the shared helper would render its tags as untouched JSX. Everything else — plugin
 * order, options, the blank-run collapse — comes from the real pipeline.
 */
async function render(mdx: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkLLMRemovals)
    .use(remarkLLMs, {
      ...llmsHandlerOptions,
      _data: true,
      stringify(node, _parent, state, info) {
        if (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement")
          return undefined;
        if (!typeTableHandler.names.includes(node.name ?? "")) return undefined;

        return typeTableHandler.render?.(node, {
          phrasing: () => state.containerPhrasing(node, info),
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
        });
      },
    });

  const tree = processor.parse(mdx) as Root;
  const file = { data: {} } as never;
  await processor.run(tree, file);

  return tidyLLMMarkdown(String((file as { data: { markdown?: string } }).data.markdown ?? ""));
}

const entry = (overrides: Partial<DocEntry>): DocEntry => ({
  name: "value",
  description: "",
  type: "string",
  simplifiedType: "string",
  tags: [],
  required: false,
  deprecated: false,
  ...overrides,
});

const doc = (...entries: DocEntry[]): GeneratedDoc => ({
  id: "TestProps",
  name: "TestProps",
  description: "",
  entries,
});

/** How `remarkAutoTypeTable` writes it: the doc is a JS expression, not a string literal. */
const typeTable = (generated: GeneratedDoc) =>
  `<TypeTable id="type-table-TestProps" type={${JSON.stringify(generated)}} />`;

describe("typeTable handler", () => {
  it("turns each entry into a prop item with its fields nested underneath", async () => {
    const actual = await render(
      typeTable(
        doc(
          entry({
            name: "variant",
            description: "Works only when `variant` is `ghost`.",
            tags: [{ name: "default", text: '"brandSolid"' }],
            type: '"brandSolid" | "ghost" | undefined',
            simplifiedType: '"brandSolid" | "ghost"',
          }),
          entry({
            name: "disabled",
            description: "버튼의 비활성화 여부를 나타냅니다.",
            tags: [{ name: "default", text: "false" }],
            type: "boolean | undefined",
            simplifiedType: "boolean",
          }),
        ),
      ),
    );

    expect(actual).toBe(
      [
        "- `variant`",
        '  - type: `"brandSolid" | "ghost" | undefined`',
        '  - default: `"brandSolid"`',
        "  - description: Works only when `variant` is `ghost`.",
        "- `disabled`",
        "  - type: `boolean | undefined`",
        "  - default: `false`",
        "  - description: 버튼의 비활성화 여부를 나타냅니다.",
      ].join("\n"),
    );
  });

  it("shows required and deprecated as fields of their own", async () => {
    const actual = await render(
      typeTable(
        doc(
          entry({
            name: "children",
            type: "ReactNode",
            simplifiedType: "ReactNode",
            required: true,
          }),
          entry({ name: "legacy", type: "string | undefined", deprecated: true }),
        ),
      ),
    );

    expect(actual).toBe(
      [
        "- `children`",
        "  - type: `ReactNode`",
        "  - required: `true`",
        "- `legacy`",
        "  - type: `string | undefined`",
        "  - deprecated: `true`",
      ].join("\n"),
    );
  });

  it("omits an empty description", async () => {
    const actual = await render(typeTable(doc(entry({ required: true }))));

    expect(actual).toBe("- `value`\n  - type: `string`\n  - required: `true`");
  });

  // The old rule emitted text nodes and let remark escape them, so a description came out
  // as `snake\_case`. Going through `stringify` writes it as the author typed it.
  it("leaves markdown punctuation in a description unescaped", async () => {
    const actual = await render(
      typeTable(doc(entry({ description: "snake_case 와 *별표* 를 그대로 둡니다." }))),
    );

    expect(actual).toBe(
      "- `value`\n  - type: `string`\n  - description: snake_case 와 *별표* 를 그대로 둡니다.",
    );
  });

  it("reads the default from a `defaultValue` tag too", async () => {
    const actual = await render(
      typeTable(doc(entry({ tags: [{ name: "defaultValue", text: "false" }] }))),
    );

    expect(actual).toBe("- `value`\n  - type: `string`\n  - default: `false`");
  });

  it("collapses a description that runs over several lines", async () => {
    const actual = await render(
      typeTable(doc(entry({ description: "  첫 줄입니다.\n\n  둘째 줄입니다.  " }))),
    );

    expect(actual).toBe(
      "- `value`\n  - type: `string`\n  - description: 첫 줄입니다. 둘째 줄입니다.",
    );
  });

  it("widens the fence around a type that holds backticks", async () => {
    // A template literal type — the everyday way a backtick lands inside `type`.
    const actual = await render(typeTable(doc(entry({ type: "`px` | `rem`" }))));

    expect(actual).toBe("- `value`\n  - type: `` `px` | `rem` ``");
  });

  it("keeps the surrounding markdown around the list", async () => {
    const actual = await render(`## Props\n\n${typeTable(doc(entry({})))}\n\n본문입니다.`);

    expect(actual).toBe("## Props\n\n- `value`\n  - type: `string`\n\n본문입니다.");
  });

  it("reads the doc from a string attribute as well as an expression", async () => {
    const actual = await render(
      `<TypeTable type='${JSON.stringify(doc(entry({ name: "variant" })))}' />`,
    );

    expect(actual).toBe("- `variant`\n  - type: `string`");
  });

  it("keeps the tag when the type attribute is missing", async () => {
    expect(await render('<TypeTable id="type-table-TestProps" />')).toContain("<TypeTable");
  });

  it("keeps the tag when the payload is not JSON", async () => {
    expect(await render("<TypeTable type={notJson} />")).toContain("<TypeTable");
  });

  it("keeps the tag when the doc holds no entries", async () => {
    expect(await render(typeTable(doc()))).toContain("<TypeTable");
  });
});
