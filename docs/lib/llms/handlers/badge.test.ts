import { describe, expect, it } from "bun:test";
import { renderLLMMarkdown } from "../render-test-utils";

describe("badge handler", () => {
  it("brackets a block-level badge on its own line", async () => {
    const actual = await renderLLMMarkdown(
      '## 제목\n\n<Badge variant="weak" tone="warning">직접 판단 필요</Badge>\n\n본문입니다.',
    );

    expect(actual).toContain("\n[직접 판단 필요]\n");
    expect(actual).not.toContain("Badge");
  });

  it("brackets an inline badge without breaking the sentence", async () => {
    const actual = await renderLLMMarkdown(
      '- <Badge tone="neutral">타입 에러로 발견 가능</Badge>: 패키지를 올리면 잡혀요.',
    );

    expect(actual).toBe("- [타입 에러로 발견 가능]: 패키지를 올리면 잡혀요.");
  });

  // The old rule emitted a text node and let remark escape the bracket, so the output
  // read `\[label]`. Going through `stringify` writes the label verbatim.
  it("leaves the bracket unescaped", async () => {
    expect(await renderLLMMarkdown("<Badge>라벨</Badge>")).toBe("[라벨]");
  });

  it("drops a badge with no label rather than leaving the tag", async () => {
    const actual = await renderLLMMarkdown('앞\n\n<Badge tone="neutral" />\n\n뒤');

    expect(actual).toBe("앞\n\n뒤");
  });

  it("leaves other JSX alone", async () => {
    expect(await renderLLMMarkdown("<Callout>유지됩니다</Callout>")).toContain("<Callout>");
  });
});
