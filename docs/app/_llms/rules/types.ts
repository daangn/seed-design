import type { RootContent } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

export interface RuleContext {
  getStringAttribute: (node: MdxJsxFlowElement, name: string) => string | undefined;
  normalizeCodeIndent: (code: string) => string;
}

export interface Rule {
  name: string;
  match: (node: RootContent) => node is MdxJsxFlowElement;
  transform: (
    node: MdxJsxFlowElement,
    context: RuleContext,
  ) => RootContent[] | Promise<RootContent[]>;
}
