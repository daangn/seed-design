import { describe, expect, it } from "bun:test";
import { renderLLMMarkdown } from "../render-test-utils";

describe("token reference handler", () => {
  it("turns a group into that collection's table", async () => {
    const actual = await renderLLMMarkdown(`<TokenReference groups={["radius"]} />`);

    expect(actual.split("\n").slice(0, 2)).toEqual(["| Token | default |", "| --- | --- |"]);
    expect(actual).toContain("| $radius.r1 | 4px |");
    expect(actual).not.toContain("TokenReference");
  });

  it("nests the group segments into the token prefix", async () => {
    const actual = await renderLLMMarkdown(`<TokenReference groups={["color", "palette"]} />`);

    expect(actual).toContain("| Token | theme-light | theme-dark |");
    expect(actual).toContain("| $color.palette.gray-00 | #ffffff | #000000 |");
    // `$color.bg.*`는 `$color.palette.` 접두사 밖이라 빠진다.
    expect(actual).not.toContain("| $color.bg.");
  });

  it("writes every collection with a heading when no group is given", async () => {
    const actual = await renderLLMMarkdown("<TokenReference />");

    expect(actual).toContain("## Radius\n\n| Token | default |");
    expect(actual).toContain("## Color\n\n| Token | theme-light | theme-dark |");
    expect(actual).toContain("$radius.r1");
    expect(actual).toContain("$color.palette.gray-00");
  });

  it("filters by regex across every collection", async () => {
    const actual = await renderLLMMarkdown(
      String.raw`<TokenReference regex={/^\$color\..*-pressed$/} />`,
    );

    expect(actual).toContain("| $color.bg.brand-solid-pressed |");
    expect(actual).not.toContain("| $color.bg.brand-solid |");
  });

  it("reads groups written as a string attribute", async () => {
    const actual = await renderLLMMarkdown(
      `<TokenReference groups="[&#x22;color&#x22;, &#x22;palette&#x22;]" />`,
    );

    expect(actual).toContain("| $color.palette.gray-00 | #ffffff | #000000 |");
    expect(actual).not.toContain("TokenReference");
  });

  it("reads a regex written as a string attribute", async () => {
    const actual = await renderLLMMarkdown(
      String.raw`<TokenReference regex="/\$color\..*-pressed$/" />`,
    );

    expect(actual).toContain("| $color.bg.brand-solid-pressed |");
    expect(actual).not.toContain("TokenReference");
  });

  it("keeps the tag when the group is unknown", async () => {
    const actual = await renderLLMMarkdown(`<TokenReference groups={["nonexistent"]} />`);

    // 처리되지 않은 JSX는 fumadocs가 다시 직렬화하므로 식 속성이 문자열 속성이 된다.
    expect(actual).toBe(`<TokenReference groups="[&#x22;nonexistent&#x22;]" />`);
  });

  it("keeps the tag when the regex matches nothing", async () => {
    const actual = await renderLLMMarkdown(String.raw`<TokenReference regex={/\$nothing\..*/} />`);

    expect(actual).toContain("<TokenReference");
  });

  it("falls back to every collection when groups is not a string array", async () => {
    for (const attribute of [`groups="radius"`, `groups={"radius"}`, "groups"]) {
      const actual = await renderLLMMarkdown(`<TokenReference ${attribute} />`);

      expect(actual).toContain("## Radius\n\n| Token | default |");
      expect(actual).toContain("## Color\n\n| Token | theme-light | theme-dark |");
    }
  });

  it("ignores a regex attribute that is not a regex literal", async () => {
    const actual = await renderLLMMarkdown(`<TokenReference regex="/(/" groups={["radius"]} />`);

    expect(actual).toContain("| $radius.r1 | 4px |");
  });

  it("keeps surrounding prose around the table", async () => {
    const actual = await renderLLMMarkdown(
      `앞 문단\n\n<TokenReference groups={["radius"]} />\n\n뒤 문단`,
    );

    expect(actual.startsWith("앞 문단\n\n| Token | default |")).toBe(true);
    expect(actual.endsWith("뒤 문단")).toBe(true);
  });
});
