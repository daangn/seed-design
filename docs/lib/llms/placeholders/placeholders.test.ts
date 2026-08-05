import { describe, expect, it } from "bun:test";
import { remarkLLMs } from "fumadocs-core/mdx-plugins/remark-llms";
import type { Root } from "mdast";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { llmsHandlerOptions, renderLLMPlaceholders, tidyLLMMarkdown } from "../options";

/**
 * Compile only, leaving the markers unfilled. Handler tests can go straight to the final
 * text, but these need the intermediate: the whole point of a placeholder is that the
 * value is not knowable here, and asserting on the marker is what proves the tag reached
 * read time instead of being stringified as JSX.
 */
async function compile(mdx: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkLLMs, { ...llmsHandlerOptions, _data: true });

  const tree = processor.parse(mdx) as Root;
  const file = { data: {} } as never;
  await processor.run(tree, file);

  return String((file as { data: { markdown?: string } }).data.markdown ?? "");
}

const marker = (name: string) => new RegExp(`\0\\{"name":"${name}"`);

describe("placeholder compilation", () => {
  it.each(["ChangelogPage", "ProgressBoardTable"])("defers <%s> to read time", async (name) => {
    const compiled = await compile(`앞 문단\n\n<${name} />\n\n뒤 문단`);

    expect(compiled).toMatch(marker(name));
    expect(compiled).not.toContain(`<${name}`);
  });

  it("leaves a tag nobody claims to the default stringifier", async () => {
    const compiled = await compile("<Callout>유지됩니다</Callout>");

    expect(compiled).not.toContain("\0");
    expect(compiled).toContain("유지됩니다");
  });
});

describe("renderLLMPlaceholders", () => {
  it("fills ChangelogPage with one section per package", async () => {
    const actual = tidyLLMMarkdown(await renderLLMPlaceholders(await compile("<ChangelogPage />")));

    expect(actual).not.toContain("\0");
    const names = [...actual.matchAll(/^## (@seed-design\/\S+)$/gm)].map(([, name]) => name);
    expect(names.length).toBeGreaterThan(1);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    expect(actual).toContain("\n---\n");
    expect(actual).not.toMatch(/^# @seed-design\//m);
  });

  it("keeps surrounding content around a filled marker", async () => {
    const actual = tidyLLMMarkdown(
      await renderLLMPlaceholders(await compile("앞 문단\n\n<ChangelogPage />\n\n뒤 문단")),
    );

    expect(actual.indexOf("앞 문단")).toBeLessThan(actual.indexOf("## @seed-design/"));
    expect(actual.indexOf("## @seed-design/")).toBeLessThan(actual.indexOf("뒤 문단"));
  });

  // The board fetches Sanity, so which branch runs depends on whether the network is up.
  // Both are acceptable; what must hold either way is that the marker never survives —
  // an unfilled one reaches the reader as a NUL-wrapped JSON blob. An empty fetch restores
  // the tag rather than emitting empty tables, which would read as "nothing is
  // implemented" instead of "the fetch failed".
  it("leaves no marker behind, whichever branch the board takes", async () => {
    const actual = tidyLLMMarkdown(
      await renderLLMPlaceholders(await compile('<ProgressBoardTable filter="react" />')),
    );

    expect(actual).not.toContain("\0");
    expect(
      actual === '<ProgressBoardTable filter="react" />' || actual.includes("### 플랫폼별 진행률"),
    ).toBe(true);
  });
});
