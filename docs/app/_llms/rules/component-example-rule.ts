import type { RootContent } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Rule, RuleContext } from "./types";

function createPreviewHeading(): RootContent {
  return {
    type: "heading",
    depth: 2,
    children: [{ type: "text", value: "Preview" }],
  };
}

function shouldInsertPreviewHeading(node: MdxJsxFlowElement, context: RuleContext): boolean {
  const exampleName = context.getStringAttribute(node, "name");
  return typeof exampleName === "string" && exampleName.endsWith("/preview");
}

export const componentExampleRule: Rule = {
  name: "ComponentExample",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "ComponentExample",
  transform: (node, context) => {
    try {
      const nodes: RootContent[] = [];

      if (shouldInsertPreviewHeading(node, context)) {
        nodes.push(createPreviewHeading());
      }

      nodes.push(...(node.children as RootContent[]));
      return nodes;
    } catch {
      return [node];
    }
  },
};
