import { describe, expect, it } from "bun:test";
import { combineLLMTexts, convertLLMTextToFullText } from "./generate-llms-full";

const createLLMText = (title: string, pagePath: string, body: string) => `# ${title}
URL: /react/${pagePath.replace(/\.mdx$/, "")}
Source: https://github.com/daangn/seed-design/blob/dev/docs/content/react/${pagePath}

설명

${body}`;

describe("generate llms-full", () => {
  it("페이지별 문서를 전체 문서 형식으로 바꿉니다", () => {
    expect(convertLLMTextToFullText(createLLMText("버튼", "버튼.mdx", "본문"), "react")).toEqual({
      pagePath: "버튼.mdx",
      text: "file: 버튼.mdx\n\n# 버튼\n\n설명\n\n본문",
    });
  });

  it("소스 경로 순서로 문서를 합칩니다", () => {
    expect(
      combineLLMTexts(
        [createLLMText("B", "b.mdx", "두 번째"), createLLMText("A", "a.mdx", "첫 번째")],
        "react",
      ),
    ).toBe("file: a.mdx\n\n# A\n\n설명\n\n첫 번째\n\n---\n\nfile: b.mdx\n\n# B\n\n설명\n\n두 번째");
  });

  it("다른 콘텐츠 디렉터리의 문서는 거부합니다", () => {
    expect(() =>
      convertLLMTextToFullText(createLLMText("버튼", "button.mdx", "본문"), "lynx"),
    ).toThrow("소스 경로가 예상과 다릅니다");
  });

  it("페이지별 문서가 없으면 실패합니다", () => {
    expect(() => combineLLMTexts([], "react")).toThrow("합칠 페이지별 LLM 문서가 없습니다");
  });
});
