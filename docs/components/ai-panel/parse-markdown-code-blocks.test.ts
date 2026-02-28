import { describe, expect, it } from "bun:test";
import { parseMarkdownCodeBlocks } from "./parse-markdown-code-blocks";

describe("parseMarkdownCodeBlocks", () => {
  it("splits text and fenced code blocks", () => {
    const input = "설명\n```tsx\nconst a = 1;\n```\n끝";

    expect(parseMarkdownCodeBlocks(input)).toEqual([
      { type: "text", text: "설명\n" },
      { type: "code", language: "tsx", code: "const a = 1;" },
      { type: "text", text: "\n끝" },
    ]);
  });

  it("falls back to tsx language when missing", () => {
    const input = "```\nconsole.log('hi')\n```";

    expect(parseMarkdownCodeBlocks(input)).toEqual([
      { type: "code", language: "tsx", code: "console.log('hi')" },
    ]);
  });

  it("returns only text when no fence exists", () => {
    const input = "일반 텍스트";

    expect(parseMarkdownCodeBlocks(input)).toEqual([{ type: "text", text: input }]);
  });
});
