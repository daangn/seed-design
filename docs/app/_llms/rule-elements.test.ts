import { describe, expect, it } from "bun:test";
import { compileMdx } from "@fumadocs/satteri/compile";
import { remarkLlms } from "@fumadocs/satteri/remark-llms";
import { type FilterElement, remarkApplyLlmsFilter } from "@/lib/satteri/remark-llms-filter";
import { llmsHandlerOptions, removeForLLMs, tidyLLMMarkdown } from "@/lib/llms/options";
import { handlers, placeholders } from "@/lib/llms/registry";
import { RULE_ELEMENT_NAMES, preserveRuleElements } from "./rule-elements";

// source.tsx의 검색용 필터 자리에 놓는 대역. 실제 필터는 File·Callout 같은 몇 개를 살려 두지만,
// 여기서는 전부 접어 보존이 preserveRuleElements 덕분임을 분명히 한다.
const foldEveryElement: FilterElement = (node) =>
  node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement" ? "children-only" : true;

/** source.tsx가 조립하는 것과 같은 순서·같은 옵션. */
async function toProcessed(source: string): Promise<string> {
  const filterElement: FilterElement = (node) =>
    removeForLLMs(node) ? false : preserveRuleElements(foldEveryElement)(node);

  const result = await compileMdx({
    source,
    filePath: "/tmp/doc.mdx",
    options: {
      mdastPlugins: [
        remarkApplyLlmsFilter(filterElement),
        remarkLlms({ ...llmsHandlerOptions, as: "processed" }),
      ],
    },
  });

  return tidyLLMMarkdown(result.data.markdown ?? "");
}

describe("preserveRuleElements", () => {
  it("핸들러가 다루지 않는 컴포넌트는 태그를 접고 자식만 남긴다", async () => {
    expect(await toProcessed('<UiOnly title="지워야 함">본문은 남는다</UiOnly>')).toBe(
      "본문은 남는다",
    );
  });

  it("MDX 원문에서 핸들러 출력까지 이어진다", async () => {
    const source = [
      '<AvailableSince packages="@seed-design/react@2.0.0" />',
      "",
      "본문 안 <Badge>직접 판단</Badge> 배지.",
    ].join("\n");

    expect(await toProcessed(source)).toBe(
      "사용 가능 버전: @seed-design/react@2.0.0\n\n본문 안 [직접 판단] 배지.",
    );
  });

  // CodeBlockTabs 핸들러는 자식 <CodeBlockTab>의 value 속성으로 탭 이름을 읽는다. 부모만
  // 살리면 자식이 접혀 value가 사라지고, 핸들러는 코드만 남은 노드를 그대로 돌려준다.
  it("CodeBlockTabs 안의 CodeBlockTab까지 남겨 탭 이름을 읽게 한다", async () => {
    const fence = "```";
    const source = [
      '<CodeBlockTabs defaultValue="one">',
      "  <CodeBlockTabsList>",
      '    <CodeBlockTabsTrigger value="one">one</CodeBlockTabsTrigger>',
      "  </CodeBlockTabsList>",
      '  <CodeBlockTab value="one">',
      `    ${fence}bash`,
      "    seed add button",
      `    ${fence}`,
      "  </CodeBlockTab>",
      "</CodeBlockTabs>",
    ].join("\n");

    expect(await toProcessed(source)).toBe("- one: seed add button");
  });
});

describe("RULE_ELEMENT_NAMES", () => {
  // 부모 핸들러가 속성만 읽고 마는 자식. 스스로를 주장하는 핸들러는 없지만, 접히면
  // 부모가 탭 이름을 잃는다.
  const PRESERVED_WITHOUT_OWN_HANDLER = ["CodeBlockTab"];

  const claimed = [...handlers, ...placeholders].flatMap((entry) => entry.names);

  it("핸들러와 placeholder가 주장하는 태그를 빠짐없이 담는다", () => {
    const missing = claimed.filter((name) => !RULE_ELEMENT_NAMES.includes(name as never));

    expect(missing.sort()).toEqual([]);
  });

  it("아무도 주장하지 않는 태그를 남겨 두지 않는다", () => {
    const unclaimed: string[] = RULE_ELEMENT_NAMES.filter((name) => !claimed.includes(name));

    expect(unclaimed.sort()).toEqual(PRESERVED_WITHOUT_OWN_HANDLER);
  });
});
