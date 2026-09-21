import { describe, expect, it } from "bun:test";
import { compileMdx } from "@fumadocs/satteri/compile";
import { remarkLlms } from "@fumadocs/satteri/remark-llms";
import { remarkStructure } from "@fumadocs/satteri/remark-structure";
import { remarkDropLlmOnly } from "./remark-drop-llm-only";
import { structureOptions } from "./search-structure";

const source = "앞 문단\n\n<LLMOnly>\n\n마크다운에만 싣는 문장\n\n</LLMOnly>\n\n뒤 문단";

describe("remarkDropLlmOnly", () => {
  it("remarkLlms 뒤에 두면 마크다운에는 남고 검색 색인에서는 빠진다", async () => {
    const result = await compileMdx({
      source,
      filePath: "/tmp/doc.mdx",
      options: {
        mdastPlugins: [
          remarkLlms({ as: "processed" }),
          remarkDropLlmOnly(),
          remarkStructure(structureOptions),
        ],
      },
    });

    expect(result.data.markdown).toBe(
      "앞 문단\n\n<LLMOnly>\n  마크다운에만 싣는 문장\n</LLMOnly>\n\n뒤 문단\n\n",
    );
    expect(result.data.structuredData?.contents).toEqual([
      { heading: undefined, content: "앞 문단" },
      { heading: undefined, content: "뒤 문단" },
    ]);
  });

  it("페이지 렌더 트리에서 태그와 본문을 함께 뺀다", async () => {
    const result = await compileMdx({
      source,
      filePath: "/tmp/doc.mdx",
      options: { mdastPlugins: [remarkDropLlmOnly()] },
    });

    expect(result.code).not.toContain("LLMOnly");
    expect(result.code).not.toContain("마크다운에만 싣는 문장");
  });
});
