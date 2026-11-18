import type { RootContent } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Rule, RuleContext } from "./types";

function shouldInsertPreviewHeading(node: MdxJsxFlowElement, context: RuleContext): boolean {
  return context.getStringAttribute(node, "name")?.endsWith("/preview") === true;
}

export const lynxComponentExampleRule: Rule<MdxJsxFlowElement> = {
  name: "LynxComponentExample",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "LynxComponentExample",
  transform: (node, context) => {
    try {
      const children = node.children as RootContent[];
      if (!shouldInsertPreviewHeading(node, context)) return children;
      return [
        { type: "heading", depth: 2, children: [{ type: "text", value: "Preview" }] },
        ...children,
      ];
    } catch {
      return [node];
    }
  },
};
