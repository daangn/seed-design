import { describe, expect, it } from "bun:test";
import { splitHighlights, splitQueryTerms } from "./search-text";

describe("splitQueryTerms", () => {
  it("splits on every separator a token id can contain", () => {
    expect(splitQueryTerms("$color.bg.neutral-solid")).toEqual(["color", "bg", "neutral", "solid"]);
  });

  it("returns nothing for separators alone", () => {
    expect(splitQueryTerms(" .-. ")).toEqual([]);
  });
});

describe("splitHighlights", () => {
  it("marks each term and leaves the separators between them plain", () => {
    expect(splitHighlights("$color.bg.neutral-solid", ["bg", "neutral"])).toEqual([
      { text: "$color.", match: false },
      { text: "bg", match: true },
      { text: ".", match: false },
      { text: "neutral", match: true },
      { text: "-solid", match: false },
    ]);
  });

  it("matches case-insensitively", () => {
    expect(splitHighlights("Action Button", ["button"])).toEqual([
      { text: "Action ", match: false },
      { text: "Button", match: true },
    ]);
  });

  it("keeps the text whole when there are no terms", () => {
    expect(splitHighlights("$radius.r3", [])).toEqual([{ text: "$radius.r3", match: false }]);
  });

  it("treats a term with regex syntax as literal text", () => {
    expect(splitHighlights("a+b", ["a+"])).toEqual([
      { text: "a+", match: true },
      { text: "b", match: false },
    ]);
  });
});
