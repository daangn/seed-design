import { describe, expect, it } from "bun:test";
import { compileMdx } from "@fumadocs/satteri/compile";
import { remarkLlms } from "@fumadocs/satteri/remark-llms";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { type FilterElement, remarkApplyLlmsFilter } from "@/lib/satteri/remark-llms-filter";
import { normalizeLLMBody } from "./normalize-llm-body";
import { ELEMENTS_WITHOUT_RULE, RULE_ELEMENT_NAMES, preserveRuleElements } from "./rule-elements";
import { activeRules } from "./rules";
import { normalizeForAssert } from "./test-utils";

// source.tsx의 검색용 필터 자리에 놓는 대역. 실제 필터는 File·Callout 같은 몇 개를 살려 두지만,
// 여기서는 전부 접어 보존이 preserveRuleElements 덕분임을 분명히 한다.
const foldEveryElement: FilterElement = (node) =>
  node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement" ? "children-only" : true;

async function toProcessed(source: string): Promise<string> {
  const result = await compileMdx({
    source,
    filePath: "/tmp/doc.mdx",
    options: {
      mdastPlugins: [
        remarkApplyLlmsFilter(preserveRuleElements(foldEveryElement)),
        remarkLlms({ as: "processed" }),
      ],
    },
  });

  return normalizeForAssert(result.data.markdown ?? "");
}

const jsxNode = (name: string): MdxJsxFlowElement => ({
  type: "mdxJsxFlowElement",
  name,
  attributes: [],
  children: [],
});

describe("preserveRuleElements", () => {
  it("자식 없는 룰 컴포넌트도 processed에 JSX 그대로 남긴다", async () => {
    const source = RULE_ELEMENT_NAMES.map((name) => `<${name} />`).join("\n\n");

    expect(await toProcessed(source)).toBe(source);
  });

  it("룰이 다루지 않는 컴포넌트는 태그를 접고 자식만 남긴다", async () => {
    expect(await toProcessed('<UiOnly title="지워야 함">본문은 남는다</UiOnly>')).toBe(
      "본문은 남는다",
    );
  });

  it("MDX 원문에서 룰 출력까지 이어진다", async () => {
    const source = [
      '<AvailableSince packages="@seed-design/react@2.0.0" />',
      "",
      "본문 안 <Badge>직접 판단</Badge> 배지.",
    ].join("\n");

    expect(normalizeLLMBody(await toProcessed(source))).toBe(
      "사용 가능 버전: @seed-design/react@2.0.0\n\n본문 안 \\[직접 판단] 배지.",
    );
  });

  // CodeBlockTabs 룰은 자식 <CodeBlockTab>의 value 속성으로 탭 이름을 읽는다. 부모만 살리면
  // 자식이 접혀 value가 사라지고, 룰은 코드만 남은 원본 노드를 그대로 돌려준다.
  it("CodeBlockTabs 안의 CodeBlockTab까지 남겨 탭 이름을 읽게 한다", async () => {
    const source = [
      '<CodeBlockTabs defaultValue="npm">',
      "  <CodeBlockTabsList>",
      '    <CodeBlockTabsTrigger value="npm">npm</CodeBlockTabsTrigger>',
      "  </CodeBlockTabsList>",
      '  <CodeBlockTab value="npm">',
      "    ```bash",
      "    npm i seed",
      "    ```",
      "  </CodeBlockTab>",
      '  <CodeBlockTab value="pnpm">',
      "    ```bash",
      "    pnpm add seed",
      "    ```",
      "  </CodeBlockTab>",
      "</CodeBlockTabs>",
    ].join("\n");

    expect(normalizeLLMBody(await toProcessed(source))).toBe(
      "- npm: npm i seed\n- pnpm: pnpm add seed",
    );
  });
});

describe("RULE_ELEMENT_NAMES", () => {
  // 예외 사유는 rule-elements.ts의 RULE_ELEMENT_NAMES 주석에 있다.
  const RULE_NAMES_WITHOUT_PRESERVED_ELEMENT = ["TypeTable"];

  it("활성 룰이 매치하는 컴포넌트를 빠짐없이 담는다", () => {
    const unpreserved = activeRules
      .filter((rule) => !RULE_ELEMENT_NAMES.some((name) => rule.match(jsxNode(name))))
      .map((rule) => rule.name);

    expect(unpreserved).toEqual(RULE_NAMES_WITHOUT_PRESERVED_ELEMENT);
  });

  // 위 단언의 반대 방향. 룰을 지우면서 이름을 안 지우면 그 태그가 llms.txt 본문에 실려
  // 나가는데, 그건 실패가 아니라 출력물 오염으로만 나타나 어떤 테스트도 잡지 못했다.
  // `CodeBlockTab`은 부모 룰이 속성을 읽는 자식이라 자기 룰이 없는 게 정상이다.
  it("룰 없이 남긴 이름은 선언된 것뿐이다", () => {
    const parentReadChildren = ["CodeBlockTab"];
    const ruleless = RULE_ELEMENT_NAMES.filter(
      (name) =>
        !parentReadChildren.includes(name) &&
        !activeRules.some((rule) => rule.match(jsxNode(name))),
    );

    expect(ruleless).toEqual([...ELEMENTS_WITHOUT_RULE]);
  });
});

describe("activeRules", () => {
  // 룰 단위 테스트는 룰을 명시 배열로 넘겨 돌리므로, 룰이 activeRules에서 빠져도 계속 통과한다.
  // 등록 자체를 여기서 고정해야 실제 파이프라인에서 조용히 사라진 룰이 잡힌다. 순서까지 보는 건
  // rules/index.ts가 활성 순서의 단일 진입점이기 때문이다.
  it("등록된 룰과 그 순서를 고정한다", () => {
    expect(activeRules.map((rule) => rule.name)).toMatchInlineSnapshot(`
      [
        "AvailableSince",
        "Badge",
        "ComponentExample",
        "LynxComponentExample",
        "CodeBlockTabs",
        "TypeTable",
        "TokenReference",
        "ProgressBoardTable",
        "IconLibrary",
        "ComponentSpecBlock",
        "ChangelogPage",
      ]
    `);
  });
});
