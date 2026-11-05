import { describe, expect, it } from "bun:test";
import { compileMdx } from "@fumadocs/satteri/compile";
import { remarkLlms } from "@fumadocs/satteri/remark-llms";
import { remarkApplyLlmsFilter } from "./remark-llms-filter";

describe("remarkApplyLlmsFilter", () => {
  it("children-only MDX 요소의 태그와 속성을 LLM 출력에서 제외한다", async () => {
    const result = await compileMdx({
      source: '<TypeTable type="매우 큰 속성">보존할 본문</TypeTable>',
      filePath: "/tmp/doc.mdx",
      options: {
        mdastPlugins: [
          remarkApplyLlmsFilter((node) =>
            "name" in node && node.name === "TypeTable" ? "children-only" : true,
          ),
          remarkLlms({ as: "processed" }),
        ],
      },
    });

    expect(result.data.markdown).toContain("보존할 본문");
    expect(result.data.markdown).not.toContain("TypeTable");
    expect(result.data.markdown).not.toContain("매우 큰 속성");
  });
});
