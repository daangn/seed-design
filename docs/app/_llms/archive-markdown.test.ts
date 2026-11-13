import { expect, it } from "bun:test";
import { archiveMarkdown } from "./archive-markdown";
import { normalizeLLMBody } from "./normalize-llm-body";

it("scopes Markdown links and images while preserving installation code", () => {
  const input =
    "[Button](/react/components/button)\n\n![Example](/example.png)\n\n```sh\nbunx seed-design add button --baseUrl https://seed-design.io\n```\n";
  const output = archiveMarkdown(input, "react/v2");
  expect(output).toBe(
    "[Button](/react/v2/components/button)\n\n![Example](/react/v2/_assets/example.png)\n\n```sh\nbunx seed-design add button --baseUrl https://seed-design.io\n```\n",
  );
  expect(archiveMarkdown(input, "")).toBe(input);
});

it("scopes MDX href and src attributes while preserving expressions and inline code", () => {
  const input = [
    '<Card href="/react/components/action-button">Open</Card>',
    '<a href="/foundations">Foundation</a>',
    '<img src="/badge.svg" />',
    "<Dynamic href={destination} />",
    '`<Card href="/react/components/action-button" />`',
  ].join("\n\n");

  expect(archiveMarkdown(input, "react/v2", "mdx")).toBe(
    [
      '<Card href="/react/v2/components/action-button">Open</Card>',
      '<a href="https://seed-design.io/foundations">Foundation</a>',
      '<img src="/react/v2/_assets/badge.svg" />',
      "<Dynamic href={destination} />",
      '`<Card href="/react/components/action-button" />`',
    ].join("\n\n") + "\n",
  );
});

it("keeps ordinary changelog Markdown syntax outside the MDX parser", () => {
  expect(archiveMarkdown("- Change {from: old, to: new}.\n", "react/v2")).toBe(
    "* Change {from: old, to: new}.\n",
  );
});

it("archives registry CLI commands flattened from package manager tabs", () => {
  const tab = (value: string, command: string) => [
    `  <CodeBlockTab value="${value}">`,
    "    ```bash",
    `    ${command}`,
    "    ```",
    "  </CodeBlockTab>",
  ];
  const input = [
    '<CodeBlockTabs defaultValue="npm">',
    ...tab("npm", "npx @seed-design/cli@latest add [...item-ids]"),
    ...tab("pnpm", "pnpm dlx @seed-design/cli add ui:action-button --seed-react-version 2"),
    ...tab("yarn", "yarn add @seed-design/react"),
    "</CodeBlockTabs>",
  ].join("\n");

  expect(archiveMarkdown(normalizeLLMBody(input), "react/v2", "mdx")).toBe(
    [
      "* npm: npx @seed-design/cli\\@latest add --baseUrl https://seed-design.io/react/v2 \\[...item-ids]",
      "* pnpm: pnpm dlx @seed-design/cli add ui:action-button --seed-react-version 2",
      "* yarn: yarn add @seed-design/react",
    ].join("\n") + "\n",
  );
});
