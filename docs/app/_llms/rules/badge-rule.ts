import type { RootContent } from "mdast";
import type { Rule, RuleNode } from "./types";

/*
  <Badge>직접 판단 필요</Badge> 처럼 시각적 강조용으로만 쓰는 Badge를
  llms.txt에서는 `[직접 판단 필요]` 텍스트로 변환합니다. block(자체 줄)과
  inline(문장 안)을 모두 처리하며, text 노드로 내보내 remark가 대괄호를
  `\[` 로 escape하도록 둡니다(markdown round-trip 안전).
*/
function flattenText(nodes: RootContent[]): string {
  return nodes
    .map((node) => {
      if ("value" in node && typeof node.value === "string") return node.value;
      if ("children" in node && Array.isArray(node.children))
        return flattenText(node.children as RootContent[]);
      return "";
    })
    .join("");
}

export const badgeRule: Rule = {
  name: "Badge",
  match: (node): node is RuleNode =>
    (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
    node.name === "Badge",
  transform: (node) => {
    const label = flattenText(node.children).trim();
    // 라벨이 없는(빈/아이콘 전용) Badge는 원본 JSX를 남기지 않고 제거한다.
    if (!label) return [];

    const bracketed = `[${label}]`;

    // inline(text) Badge는 문장 안에 다시 끼워넣고, block Badge는 문단으로 감싸 자체 줄로 둔다.
    if (node.type === "mdxJsxTextElement") {
      return [{ type: "text", value: bracketed }];
    }

    return [{ type: "paragraph", children: [{ type: "text", value: bracketed }] }];
  },
};
