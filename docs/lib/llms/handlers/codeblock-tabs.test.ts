import { describe, expect, it } from "bun:test";
import { remarkLLMs } from "fumadocs-core/mdx-plugins/remark-llms";
import type { Root } from "mdast";
import type { MdxJsxAttribute } from "mdast-util-mdx-jsx";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { llmsHandlerOptions, tidyLLMMarkdown } from "../options";
import { remarkLLMRemovals } from "../render-test-utils";
import { codeBlockTabsHandler } from "./codeblock-tabs";

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
        if (!codeBlockTabsHandler.names.includes(node.name ?? "")) return undefined;

        return codeBlockTabsHandler.render?.(node, {
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

const tab = (value: string, command: string) =>
  `  <CodeBlockTab value="${value}">\n    \`\`\`bash\n    ${command}\n    \`\`\`\n  </CodeBlockTab>`;

const tabs = (...children: string[]) =>
  `<CodeBlockTabs defaultValue="npm">\n${children.join("\n")}\n</CodeBlockTabs>`;

describe("codeBlockTabs handler", () => {
  it("flattens every tab to a `manager: command` line", async () => {
    const actual = await render(
      `## Installation\n\n${tabs(
        tab("npm", "npx @seed-design/cli@latest add ui:action-button"),
        tab("pnpm", "pnpm dlx @seed-design/cli@latest add ui:action-button"),
        tab("yarn", "yarn dlx @seed-design/cli@latest add ui:action-button"),
        tab("bun", "bun x @seed-design/cli@latest add ui:action-button"),
      )}`,
    );

    expect(actual).toBe(
      [
        "## Installation",
        "",
        "- npm: npx @seed-design/cli@latest add ui:action-button",
        "- pnpm: pnpm dlx @seed-design/cli@latest add ui:action-button",
        "- yarn: yarn dlx @seed-design/cli@latest add ui:action-button",
        "- bun: bun x @seed-design/cli@latest add ui:action-button",
      ].join("\n"),
    );
  });

  it("ignores the tab strip that sits alongside the panels", async () => {
    const actual = await render(
      `<CodeBlockTabs defaultValue="npm" groupId="package-manager" persist>
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="npm">npm</CodeBlockTabsTrigger>
  </CodeBlockTabsList>

${tab("npm", "npm i seed-design")}
</CodeBlockTabs>`,
    );

    expect(actual).toBe("- npm: npm i seed-design");
  });

  it("puts known managers in a fixed order and appends the rest", async () => {
    const actual = await render(
      tabs(
        tab("custom", "custom install action-button"),
        tab("npm", "npx @seed-design/cli@latest add ui:action-button"),
      ),
    );

    expect(actual).toBe(
      "- npm: npx @seed-design/cli@latest add ui:action-button\n- custom: custom install action-button",
    );
  });

  it("reorders known managers regardless of how they were authored", async () => {
    const actual = await render(
      tabs(tab("bun", "bun x cli"), tab("yarn", "yarn dlx cli"), tab("npm", "npx cli")),
    );

    expect(actual).toBe("- npm: npx cli\n- yarn: yarn dlx cli\n- bun: bun x cli");
  });

  it("keeps the original JSX when no tab holds a code block", async () => {
    const actual = await render(
      '## Installation\n\n<CodeBlockTabs defaultValue="npm">\n  <CodeBlockTab value="npm">\n    npm i seed-design\n  </CodeBlockTab>\n</CodeBlockTabs>',
    );

    expect(actual).toBe(
      '## Installation\n\n<CodeBlockTabs defaultValue="npm">\n  <CodeBlockTab value="npm">\n    npm i seed-design\n  </CodeBlockTab>\n</CodeBlockTabs>',
    );
  });

  it("skips a tab whose value is missing or not a string literal", async () => {
    const actual = await render(
      tabs(
        "  <CodeBlockTab>\n    ```bash\n    npm i unlabelled\n    ```\n  </CodeBlockTab>",
        "  <CodeBlockTab value={manager}>\n    ```bash\n    npm i expression\n    ```\n  </CodeBlockTab>",
        tab("npm", "npm i seed-design"),
      ),
    );

    expect(actual).toBe("- npm: npm i seed-design");
  });

  it("indents the continuation lines of a multi-line command", async () => {
    const actual = await render(
      tabs(
        '  <CodeBlockTab value="npm">\n    ```bash\n    npm i seed-design\n    npm run build\n    ```\n  </CodeBlockTab>',
      ),
    );

    expect(actual).toBe("- npm: npm i seed-design\n  npm run build");
  });

  it("strips the indentation a nested fence carries into the command", async () => {
    const actual = await render(
      '<CodeBlockTabs defaultValue="npm">\n  <CodeBlockTab value="npm">\n    ```bash\n        npm i seed-design\n          npm run build\n    ```\n  </CodeBlockTab>\n</CodeBlockTabs>',
    );

    expect(actual).toBe("- npm: npm i seed-design\n    npm run build");
  });

  it("leaves the command unescaped", async () => {
    const actual = await render(tabs(tab("npm", "npm i @seed-design/react_next *")));

    expect(actual).toBe("- npm: npm i @seed-design/react_next *");
  });
});
