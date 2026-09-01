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

  it("leaves a Korean compound whole, having no boundary to split on", () => {
    expect(tokenize("액션버튼")).toEqual(["액션버튼"]);
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

  it("splits an identifier the same way whichever case it is written in", () => {
    expect(tokenize("ActionButton")).toEqual(["action", "button"]);
    expect(tokenize("actionButton")).toEqual(["action", "button"]);
    expect(tokenize("action-button")).toEqual(["action", "button"]);
    expect(tokenize("action_button")).toEqual(["action", "button"]);
  });

  it("breaks before the last capital of an acronym run", () => {
    expect(tokenize("HTTPServer")).toEqual(["http", "server"]);
  });

  it("splits letters from digits", () => {
    expect(tokenize("v1Migration")).toEqual(["v", "1", "migration"]);
  });

  it("drops delimiters left at either end of a word", () => {
    expect(tokenize("-button-")).toEqual(["button"]);
    expect(tokenize("---")).toEqual([]);
  });

  it("adds the glued spelling when indexing, so a document also answers to it", () => {
    expect(tokenize("ActionButton", undefined, "content")).toEqual([
      "action",
      "button",
      "actionbutton",
    ]);
  });

  it("leaves the query unglued, so it still matches a title written as two words", () => {
    expect(tokenize("ActionButton", undefined, undefined)).toEqual(["action", "button"]);
  });
});
