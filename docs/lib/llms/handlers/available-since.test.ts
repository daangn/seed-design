import { describe, expect, it } from "bun:test";
import { renderLLMMarkdown } from "../render-test-utils";

describe("availableSince handler", () => {
  it("converts the tag to a single caption line", async () => {
    const actual = await renderLLMMarkdown(
      '<AvailableSince packages="@seed-design/react@2.0.0, @seed-design/css@2.0.0" />\n\n## Import',
    );

    expect(actual).toBe(
      "사용 가능 버전: @seed-design/react@2.0.0, @seed-design/css@2.0.0\n\n## Import",
    );
  });

  it("drops the node when packages is missing", async () => {
    expect(await renderLLMMarkdown("<AvailableSince />\n\n본문입니다.")).toBe("본문입니다.");
  });

  it("drops the node when packages is blank", async () => {
    expect(await renderLLMMarkdown('<AvailableSince packages="   " />\n\n본문입니다.')).toBe(
      "본문입니다.",
    );
  });

  it("drops the node when packages is an expression rather than a string", async () => {
    expect(await renderLLMMarkdown("<AvailableSince packages={list} />\n\n본문입니다.")).toBe(
      "본문입니다.",
    );
  });
});
