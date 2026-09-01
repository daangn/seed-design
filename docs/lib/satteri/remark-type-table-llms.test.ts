import { describe, expect, it } from "bun:test";
import { compileMdx } from "@fumadocs/satteri/compile";
import { remarkAutoTypeTable } from "@fumadocs/satteri/remark-auto-type-table";
import { remarkLlms } from "@fumadocs/satteri/remark-llms";
import type { GeneratedDoc, Generator } from "fumadocs-typescript";
import { defaultHandlers } from "mdast-util-to-markdown";
import { normalizeLLMBody } from "@/app/_llms/normalize-llm-body";
import { preserveRuleElements } from "@/app/_llms/rule-elements";
import { remarkApplyLlmsFilter } from "./remark-llms-filter";
import { remarkTypeTableLlms } from "./remark-type-table-llms";
import { filterStructureElement, structureStringify } from "./search-structure";

const doc: GeneratedDoc = {
  id: "fixture.tsx-FixtureProps",
  name: "FixtureProps",
  description: "",
  entries: [
    {
      name: "tone",
      description: "배경 톤을 고릅니다.",
      tags: [{ name: "default", text: '"neutral"' }],
      type: '"neutral" | "critical" | undefined',
      simplifiedType: '"neutral" | "critical"',
      required: false,
      deprecated: false,
    },
    {
      name: "children",
      description: "",
      tags: [],
      type: "ReactNode",
      simplifiedType: "ReactNode",
      required: true,
      deprecated: false,
    },
  ],
};

/** 실제 타입을 읽지 않는 대역. ts-morph를 태우지 않고 두 pass의 연결만 봅니다. */
const generator: Generator = {
  generateDocumentation: async () => [doc],
  generateTypeTable: async () => [doc],
};

const filterLlmsElement = preserveRuleElements(filterStructureElement);

/** `app/source.tsx`의 배치와 같은 순서로 파이프라인을 세웁니다. */
async function compile(source: string) {
  const typeTableOptions = { generator, name: "react-type-table" };
  const typeTableLlms = remarkTypeTableLlms(typeTableOptions);

  return compileMdx({
    source,
    filePath: "/tmp/doc.mdx",
    options: {
      mdastPlugins: [
        typeTableLlms.captureProps,
        remarkAutoTypeTable({
          ...typeTableOptions,
          // 기본 renderer는 Shiki를 태웁니다. 검증 대상이 아니라 대역으로 바꿉니다.
          renderType: (type) => ({ type: "text", value: type }),
          renderMarkdown: (markdown) => ({ type: "text", value: markdown }),
        }),
        remarkApplyLlmsFilter(filterLlmsElement),
        typeTableLlms.emitLlmsForm,
        remarkLlms({
          as: "processed",
          handlers: { heading: defaultHandlers.heading },
          headingIds: false,
          filterElement: filterLlmsElement,
          filterMdxAttributes: structureStringify.filterMdxAttributes,
        }),
      ],
    },
  });
}

describe("remarkTypeTableLlms", () => {
  // 이번 파이프라인과 `app/_llms`의 typeTableRule이 만나는 이음매를 함께 봅니다. 둘 중 한쪽만
  // 보면 서로 다른 `type` 속성 모양을 기대한 채로 통과하고, 표는 llms.txt에서 사라집니다.
  it("props 표를 llms 본문의 목록으로 남긴다", async () => {
    const result = await compile(
      '## Props\n\n<react-type-table path="./fixture.tsx" name="FixtureProps" />\n',
    );

    expect(normalizeLLMBody(result.data.markdown)).toBe(
      [
        "## Props",
        "",
        "- `tone`",
        '  - type: `"neutral" | "critical" | undefined`',
        '  - default: `"neutral"`',
        "  - description: 배경 톤을 고릅니다.",
        "- `children`",
        "  - type: `ReactNode`",
        "  - required: `true`",
      ].join("\n"),
    );
  });

  it("표 데이터를 나르는 속성은 렌더 트리로 넘기지 않는다", async () => {
    const result = await compile('<react-type-table path="./fixture.tsx" name="FixtureProps" />\n');

    expect(result.code).not.toContain("data-llms-type-table");
  });

  // 이 pass가 손대지 못한 <TypeTable>은 필터에 접혀 흔적 없이 사라집니다. 조용한 누락이
  // 이 플러그인이 존재하는 이유이므로, 그리지 못하는 상황은 빌드를 세워야 합니다.
  it("props를 붙잡지 못한 TypeTable을 만나면 빌드를 세운다", async () => {
    expect(compile("<TypeTable />\n")).rejects.toThrow("captureProps가 남긴 props가 없습니다");
  });
});
