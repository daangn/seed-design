import { describe, expect, it } from "bun:test";
import { compileMdx } from "@fumadocs/satteri/compile";
import { remarkLlms } from "@fumadocs/satteri/remark-llms";
import { remarkDocGen } from "./remark-doc-gen";
import { remarkApplyLlmsFilter } from "./remark-llms-filter";

describe("remarkApplyLlmsFilter", () => {
  it("남기지 않는 MDX 요소의 태그와 속성을 LLM 출력에서 제외한다", async () => {
    const result = await compileMdx({
      source: '<TypeTable type="매우 큰 속성">보존할 본문</TypeTable>',
      filePath: "/tmp/doc.mdx",
      options: {
        mdastPlugins: [
          remarkApplyLlmsFilter((node) => node.name !== "TypeTable"),
          remarkLlms({ as: "processed" }),
        ],
      },
    });

    expect(result.data.markdown).toContain("보존할 본문");
    expect(result.data.markdown).not.toContain("TypeTable");
    expect(result.data.markdown).not.toContain("매우 큰 속성");
  });

  it("접은 요소 안에서 다른 플러그인이 바꿔 넣은 자식도 남긴다", async () => {
    const result = await compileMdx({
      source: "<Example>\n  ```json doc-gen:test\n  {}\n  ```\n</Example>",
      filePath: "/tmp/doc.mdx",
      options: {
        mdastPlugins: [
          remarkDocGen({
            generators: [{ name: "test", run: () => ({ type: "code", value: "생성된 코드" }) }],
          }),
          remarkApplyLlmsFilter(() => false),
          remarkLlms({ as: "processed" }),
        ],
      },
    });

    expect(result.data.markdown).toBe("```\n생성된 코드\n```\n");
  });
});
