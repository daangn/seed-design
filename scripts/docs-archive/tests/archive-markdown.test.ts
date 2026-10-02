import { expect, it } from "bun:test";
import { archiveMarkdown } from "../../../docs/app/_llms/archive-markdown";

it("scopes Markdown links and images while preserving installation code", () => {
  const input =
    "[Button](/react/components/button)\n\n![Example](/example.png)\n\n```sh\nbunx seed-design add button --baseUrl https://seed-design.io\n```\n";
  const output = archiveMarkdown(input, "v2");
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

  expect(archiveMarkdown(input, "v2", "mdx")).toBe(
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
  expect(archiveMarkdown("- Change {from: old, to: new}.\n", "v2")).toBe(
    "* Change {from: old, to: new}.\n",
  );
});

it("scopes archived installation code without altering unrelated source", () => {
  expect(
    archiveMarkdown("```sh\nnpx @seed-design/cli@latest add ui:action-button\n```\n", "v1.2"),
  ).toBe(
    "```sh\nnpx @seed-design/cli@latest add --baseUrl https://seed-design.io/react/v1.2 ui:action-button\n```\n",
  );
});
