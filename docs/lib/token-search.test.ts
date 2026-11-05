import { describe, expect, it } from "bun:test";
import { matchTokens, type TokenSearchEntry, tokenReferenceHref } from "./token-search";

function entry(id: string, overrides: Partial<TokenSearchEntry> = {}): TokenSearchEntry {
  const lastDot = id.lastIndexOf(".");
  return {
    id,
    group: id.slice(0, lastDot),
    key: id.slice(lastDot + 1),
    kind: "ColorHexLit",
    label: "#ffffff",
    ...overrides,
  };
}

const ENTRIES = [
  entry("$color.bg.neutral"),
  entry("$color.bg.neutral-solid", { description: "일반적인 콘텐츠에 사용되는 기본 배경입니다." }),
  entry("$color.bg.neutral-weak"),
  entry("$color.fg.neutral"),
  entry("$color.manner-temp.l1.bg"),
  entry("$color.palette.static-black-alpha-900"),
  entry("$dimension.spacing.x4", { kind: "DimensionLit", label: "1rem (16px)" }),
];

const ids = (search: string) => matchTokens(ENTRIES, search).map(({ id }) => id);

describe("matchTokens", () => {
  it("returns nothing for a blank query", () => {
    expect(matchTokens(ENTRIES, "   ")).toEqual([]);
  });

  it("puts an exact id first, however the separators were typed", () => {
    expect(ids("$color.bg.neutral-solid")[0]).toBe("$color.bg.neutral-solid");
    expect(ids("color bg neutral solid")[0]).toBe("$color.bg.neutral-solid");
  });

  it("ranks a last-segment match above tokens that only contain the query", () => {
    expect(ids("neutral-weak")[0]).toBe("$color.bg.neutral-weak");
  });

  it("ranks the family a segment names above tokens ending in that segment", () => {
    // "bg" is the group of `$color.bg.*` but merely the leaf of `$color.manner-temp.l1.bg`.
    expect(ids("bg")).toEqual([
      "$color.bg.neutral",
      "$color.bg.neutral-weak",
      "$color.bg.neutral-solid",
      "$color.manner-temp.l1.bg",
    ]);
  });

  it("matches a partial path spanning segments", () => {
    expect(ids("bg.neutral")).toEqual([
      "$color.bg.neutral",
      "$color.bg.neutral-weak",
      "$color.bg.neutral-solid",
    ]);
  });

  it("keeps a group together once one of its tokens ranks, without moving the top hit", () => {
    // `$color.fg.neutral` alone would rank between the two `$color.bg` tokens; grouping
    // pulls it out so the tiles don't alternate between swatch and chip.
    expect(ids("neutral")).toEqual([
      "$color.bg.neutral",
      "$color.bg.neutral-weak",
      "$color.bg.neutral-solid",
      "$color.fg.neutral",
    ]);
  });

  it("matches terms in any order", () => {
    expect(ids("solid neutral")).toEqual(["$color.bg.neutral-solid"]);
  });

  it("falls back to the Korean description", () => {
    expect(ids("배경")).toEqual(["$color.bg.neutral-solid"]);
  });

  it("prefers the id over the description when both match", () => {
    expect(ids("neutral")[0]).toBe("$color.bg.neutral");
  });

  it("returns every match so the section can reveal the rest on demand", () => {
    expect(ids("color")).toHaveLength(6);
  });

  it("ignores tokens nothing in the query points at", () => {
    expect(ids("radius")).toEqual([]);
  });
});

describe("tokenReferenceHref", () => {
  it("encodes the `$` so the id survives as a single path segment", () => {
    expect(tokenReferenceHref("$color.bg.neutral-solid")).toBe(
      "/foundations/design-token/reference/%24color.bg.neutral-solid",
    );
  });
});
