import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import { createContentHighlighter } from "fumadocs-core/search";
import { ResultMarkdown } from "../components/search/result-markdown";
import { getEntrySearchText } from "./changelog-entry";

describe("getEntrySearchText", () => {
  it("검색 행에서 꺾쇠 괄호와 앰퍼샌드를 태그가 아닌 글자로 보여준다", () => {
    const searchText = getEntrySearchText({
      contentBlocks: [
        {
          type: "markdown",
          html: "",
          plainText:
            "구형 WebView(Chrome < 84)에서 <Dialog>가 Array<string>을 받고 A & B를 씁니다.",
        },
        { type: "code", code: '<Dialog title="제목" />', lang: "tsx" },
      ],
    });

    const { container } = render(
      <ResultMarkdown>
        {createContentHighlighter("Chrome").highlightMarkdown(searchText)}
      </ResultMarkdown>,
    );

    expect(container.textContent).toBe(
      '구형 WebView(Chrome < 84)에서 <Dialog>가 Array<string>을 받고 A & B를 씁니다. <Dialog title="제목" />',
    );
    expect(container.querySelector("mark")?.textContent).toBe("Chrome");
    expect(container.querySelector("dialog")).toBeNull();
  });
});
