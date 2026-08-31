import { describe, expect, it } from "bun:test";
import { tokenize } from "./tokenizer";

describe("tokenize", () => {
  it("lowercases and splits English text on whitespace", () => {
    expect(tokenize("Action Button")).toEqual(["action", "button"]);
  });

  it("keeps Korean (Hangul) tokens — the custom splitRule includes 가-힣", () => {
    const tokens = tokenize("액션 버튼");
    expect(tokens).toContain("액션");
    expect(tokens).toContain("버튼");
  });

  it("splits on punctuation, not just spaces", () => {
    expect(tokenize("foo, bar; baz")).toEqual(["foo", "bar", "baz"]);
  });

  it("de-duplicates repeated tokens", () => {
    expect(tokenize("button button button")).toEqual(["button"]);
  });

  it("returns an empty array for punctuation-only input", () => {
    expect(tokenize("!!! ???")).toEqual([]);
  });
});
