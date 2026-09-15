import { describe, expect, it } from "bun:test";
import { remarkLLMs } from "fumadocs-core/mdx-plugins/remark-llms";
import type { Root } from "mdast";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { ComponentData } from "@/sanity-studio/lib/types";
import { llmsHandlerOptions, renderPlaceholdersWith, tidyLLMMarkdown } from "../options";
import type { LLMPlaceholder } from "../types";
import { createChangelogPagePlaceholder } from "./changelog-page";
import { createProgressBoardPlaceholder } from "./progress-board";

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

/** 합성 placeholder로 채운다. 등록된 것들은 디스크와 Sanity를 읽으므로 여기서 쓰지 않는다. */
const fill = (markdown: string, entries: LLMPlaceholder[]) =>
  renderPlaceholdersWith(markdown, entries).then(tidyLLMMarkdown);

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

describe("changelog page placeholder", () => {
  const changelog = createChangelogPagePlaceholder(async () => [
    { packageName: "@fixture/beta", raw: "# @fixture/beta\n\n## 1.0.0\n\n둘째 패키지\n" },
    { packageName: "@fixture/alpha", raw: "# @fixture/alpha\n\n## 2.0.0\n\n첫째 패키지\n" },
  ]);

  it("writes one section per package, sorted, with each file's own title dropped", async () => {
    expect(await fill(await compile("<ChangelogPage />"), [changelog])).toBe(
      [
        "## @fixture/alpha",
        "",
        "## 2.0.0",
        "",
        "첫째 패키지",
        "",
        "---",
        "",
        "## @fixture/beta",
        "",
        "## 1.0.0",
        "",
        "둘째 패키지",
      ].join("\n"),
    );
  });

  it("keeps surrounding content around a filled marker", async () => {
    const actual = await fill(await compile("앞 문단\n\n<ChangelogPage />\n\n뒤 문단"), [
      changelog,
    ]);

    expect(actual.startsWith("앞 문단\n\n## @fixture/alpha")).toBe(true);
    expect(actual.endsWith("뒤 문단")).toBe(true);
  });

  it("restores the tag when the sources cannot be read", async () => {
    const failing = createChangelogPagePlaceholder(() => Promise.reject(new Error("nope")));

    expect(await fill(await compile("<ChangelogPage />"), [failing])).toBe("<ChangelogPage />");
  });
});

describe("progress board placeholder", () => {
  const component = (id: string, name: string): ComponentData => ({
    id,
    name,
    figmaStatus: "ready",
    reactStatus: "ready",
    lynxStatus: "not-ready",
    iosStatus: "not-planned",
    androidStatus: "not-planned",
  });

  const board = createProgressBoardPlaceholder(async () => [
    component("fixture-one", "Fixture One"),
    component("fixture-two", "Fixture Two"),
  ]);

  it("writes the progress summary and the per-component table", async () => {
    const actual = await fill(await compile("<ProgressBoardTable />"), [board]);

    expect(actual).toBe(
      [
        "### 플랫폼별 진행률",
        "",
        "| Platform | Progress | Ready/Total |",
        "| --- | --- | --- |",
        "| Figma | 100% | 2/2 |",
        "| React | 100% | 2/2 |",
        "| Lynx | 0% | 0/2 |",
        "| iOS | 0% | 0/0 |",
        "| Android | 0% | 0/0 |",
        "",
        "### 컴포넌트별 상태",
        "",
        "| Component | Figma | React | Lynx | iOS | Android |",
        "| --- | --- | --- | --- | --- | --- |",
        "| Fixture One | Done | Done | Not Ready | Not Planned | Not Planned |",
        "| Fixture Two | Done | Done | Not Ready | Not Planned | Not Planned |",
      ].join("\n"),
    );
  });

  // 빈 표를 내보내면 "아무것도 구현 안 됨"으로 읽힌다. 가져오기가 실패했다는 사실이
  // 출력에 남아야 해서 태그를 되살린다.
  it("restores the tag rather than emitting empty tables", async () => {
    const empty = createProgressBoardPlaceholder(async () => []);

    expect(await fill(await compile('<ProgressBoardTable filter="react" />'), [empty])).toBe(
      '<ProgressBoardTable filter="react" />',
    );
  });
});
