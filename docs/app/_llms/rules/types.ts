import type { RootContent } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

export interface RuleContext {
  getStringAttribute: (node: MdxJsxFlowElement, name: string) => string | undefined;
  normalizeCodeIndent: (code: string) => string;
}

export interface Rule {
  name: string;
  match: (node: RootContent) => node is MdxJsxFlowElement;
  transform: (node: MdxJsxFlowElement, context: RuleContext) => RootContent[];
  /** 비동기 사전 초기화가 필요한 룰에서 구현합니다. normalizeLLMBody 호출 전 await해야 합니다. */
  init?: () => Promise<void>;
}
