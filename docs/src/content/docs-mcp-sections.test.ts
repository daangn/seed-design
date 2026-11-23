import { describe, expect, it } from "bun:test";
import { SECTIONS as MCP_SECTIONS } from "../../../packages/docs-mcp/src/config";
import { sections as fullTextSections } from "../../scripts/generate-llms-full";
import { SECTIONS } from "./sections";

// get-started는 하위 문서 없이 `/get-started/llms.txt` 한 장이라 list_docs·get_doc으로 읽을 수 없다.
const notInMcp: string[] = ["get-started"];

describe("docs-mcp sections", () => {
  it("문서 사이트가 만드는 llms 섹션을 같은 경로로 제공합니다", () => {
    const expected = Object.fromEntries(
      SECTIONS.filter((section) => section.llms && !notInMcp.includes(section.id)).map(
        (section) => [
          section.id,
          {
            basePath: `/llms/${section.id}`,
            overviewPath: `${section.baseUrl}/llms.txt`,
            fullPath: (fullTextSections as readonly string[]).includes(section.id)
              ? `${section.baseUrl}/llms-full.txt`
              : undefined,
          },
        ],
      ),
    );
    const actual = Object.fromEntries(
      Object.entries(MCP_SECTIONS).map(([id, { basePath, overviewPath, fullPath }]) => [
        id,
        { basePath, overviewPath, fullPath },
      ]),
    );

    expect(actual).toEqual(expected);
  });
});
