import { describe, expect, it } from "bun:test";
import { normalizeLLMBodyWithRules } from "../normalize-llm-body";
import { changelogPageRule } from "./changelog-page-rule";

/**
 * `<ChangelogPage>` has no attributes and no children — the whole output comes from
 * reading every `packages/*​/CHANGELOG.md` at init. These assertions describe the shape
 * that produces, so a reimplementation can be diffed against it rather than eyeballed.
 */
describe("changelogPageRule", () => {
  const render = async (input: string) => {
    await changelogPageRule.init?.();
    return normalizeLLMBodyWithRules(input, [changelogPageRule]);
  };

  it("matches only a flow-level ChangelogPage", () => {
    const matches = (node: Parameters<typeof changelogPageRule.match>[0]) =>
      changelogPageRule.match(node);

    expect(
      matches({ type: "mdxJsxFlowElement", name: "ChangelogPage", attributes: [], children: [] }),
    ).toBe(true);
    expect(
      matches({ type: "mdxJsxTextElement", name: "ChangelogPage", attributes: [], children: [] }),
    ).toBe(false);
    expect(
      matches({ type: "mdxJsxFlowElement", name: "Callout", attributes: [], children: [] }),
    ).toBe(false);
  });

  it("replaces the element with one section per package", async () => {
    const actual = await render("<ChangelogPage />");

    expect(actual).not.toContain("ChangelogPage");
    expect(actual).toContain("## @seed-design/");
  });

  it("orders packages alphabetically and separates them with a rule", async () => {
    const actual = await render("<ChangelogPage />");

    const names = [...actual.matchAll(/^## (@seed-design\/\S+)$/gm)].map(([, name]) => name);
    expect(names.length).toBeGreaterThan(1);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(actual).toContain("\n---\n");
  });

  it("drops each changelog's own title so the package heading is the only h1-level label", async () => {
    const actual = await render("<ChangelogPage />");

    expect(actual).not.toMatch(/^# @seed-design\//m);
  });

  it("leaves surrounding content in place", async () => {
    const actual = await render("앞 문단\n\n<ChangelogPage />\n\n뒤 문단");

    expect(actual.indexOf("앞 문단")).toBeLessThan(actual.indexOf("## @seed-design/"));
    expect(actual.indexOf("## @seed-design/")).toBeLessThan(actual.indexOf("뒤 문단"));
  });
});
