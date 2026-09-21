import { describe, expect, it } from "bun:test";
import { renderLLMMarkdown } from "../render-test-utils";

describe("LLMOnly handler", () => {
  it("unwraps block children, keeping their markdown", async () => {
    const actual = await renderLLMMarkdown(
      "앞 문단\n\n<LLMOnly>\n\n[GitHub](https://github.com/daangn/seed-design)에서 `CHANGELOG.md`를 확인하세요.\n\n- 항목\n\n</LLMOnly>\n\n뒤 문단",
    );

    expect(actual).toBe(
      "앞 문단\n\n[GitHub](https://github.com/daangn/seed-design)에서 `CHANGELOG.md`를 확인하세요.\n\n- 항목\n\n뒤 문단",
    );
  });

  it("unwraps an inline one without breaking the sentence", async () => {
    expect(await renderLLMMarkdown("문장 <LLMOnly>인라인</LLMOnly> 끝")).toBe("문장 인라인 끝");
  });

  it("drops an empty one rather than leaving the tag", async () => {
    expect(await renderLLMMarkdown("앞 문단\n\n<LLMOnly />\n\n뒤 문단")).toBe("앞 문단\n\n뒤 문단");
  });
});
