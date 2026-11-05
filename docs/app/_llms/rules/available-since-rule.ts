import type { Rule, RuleNode } from "./types";

/*
  <AvailableSince packages="@seed-design/react@2.0.0, @seed-design/css@2.0.0" /> 를
  llms.txt에서는 `사용 가능 버전: @seed-design/react@2.0.0, @seed-design/css@2.0.0`
  한 줄로 변환합니다.
*/
export const availableSinceRule: Rule = {
  name: "AvailableSince",
  match: (node): node is RuleNode =>
    node.type === "mdxJsxFlowElement" && node.name === "AvailableSince",
  transform: (node, context) => {
    const packages = context.getStringAttribute(node, "packages")?.trim();
    // packages가 없으면 화면에도 아무것도 안 나오므로 llms.txt에서도 지운다.
    if (!packages) return [];

    return [
      {
        type: "paragraph",
        children: [{ type: "text", value: `사용 가능 버전: ${packages}` }],
      },
    ];
  },
};
