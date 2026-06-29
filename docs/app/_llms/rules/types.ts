import type { RootContent } from "mdast";
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx-jsx";

/** 룰이 다루는 JSX 노드. block(flow)과 inline(text) 양쪽을 포함한다. */
export type RuleNode = MdxJsxFlowElement | MdxJsxTextElement;

export interface RuleContext {
  getStringAttribute: (node: RuleNode, name: string) => string | undefined;
  normalizeCodeIndent: (code: string) => string;
}

export interface Rule {
  name: string;
  match: (node: RootContent) => node is RuleNode;
  transform: (node: RuleNode, context: RuleContext) => RootContent[];
  /** 비동기 사전 초기화가 필요한 룰에서 구현합니다. normalizeLLMBody 호출 전 await해야 합니다. */
  init?: () => Promise<void>;
}
