import type { Root, RootContent } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx-jsx";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { activeRules } from "./rules";
import type { AnyRule, RuleContext, RuleNode } from "./rules/types";

const processor = unified().use(remarkParse).use(remarkMdx).use(remarkStringify, {
  bullet: "-",
  fences: true,
  listItemIndent: "one",
});

export function normalizeCodeIndent(code: string): string {
  const lines = code.replace(/\r\n/g, "\n").split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  const minIndent = nonEmptyLines.reduce((min, line) => {
    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
    return Math.min(min, indent);
  }, Number.POSITIVE_INFINITY);

  if (!Number.isFinite(minIndent) || minIndent === 0) {
    return lines.join("\n").trimEnd();
  }

  return lines
    .map((line) => line.slice(minIndent))
    .join("\n")
    .trimEnd();
}

function isMdxJsxElement(node: RootContent): node is MdxJsxFlowElement | MdxJsxTextElement {
  return node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
}

function isMdxJsxAttribute(
  attribute: MdxJsxFlowElement["attributes"][number],
): attribute is MdxJsxAttribute {
  return attribute.type === "mdxJsxAttribute";
}

export function getStringAttribute(node: RuleNode, name: string): string | undefined {
  for (const attribute of node.attributes) {
    if (!isMdxJsxAttribute(attribute) || attribute.name !== name) continue;
    if (typeof attribute.value === "string") return attribute.value;
  }

  return undefined;
}

function hasChildren(node: RootContent): node is RootContent & { children: RootContent[] } {
  return "children" in node && Array.isArray(node.children);
}

function transformNodes(
  nodes: RootContent[],
  rules: AnyRule[],
  context: RuleContext,
): RootContent[] {
  const transformed: RootContent[] = [];

  for (const node of nodes) {
    if (isMdxJsxElement(node)) {
      const matchedRule = rules.find((rule) => rule.match(node));
      if (matchedRule) {
        try {
          const nextNodes = matchedRule.transform(node, context);
          // 룰은 변환할 수 없을 때 원본 노드를 그대로 돌려준다.
          // 그 결과를 다시 돌리면 같은 룰이 다시 매치돼 스택이 넘칠 때까지 재귀하고,
          // 아래 catch가 그 RangeError를 삼켜 실패가 드러나지 않는다.
          const unchanged = nextNodes.length === 1 && nextNodes[0] === node;
          transformed.push(...(unchanged ? nextNodes : transformNodes(nextNodes, rules, context)));
        } catch {
          transformed.push(node);
        }
        continue;
      }
    }

    if (hasChildren(node)) {
      transformed.push({
        ...node,
        children: transformNodes(node.children, rules, context),
      } as RootContent);
      continue;
    }

    transformed.push(node);
  }

  return transformed;
}

export function normalizeLLMBodyWithRules(content: string | undefined, rules: AnyRule[]): string {
  if (!content) return "";

  const context: RuleContext = {
    getStringAttribute,
    normalizeCodeIndent,
  };

  const tree = processor.parse(content) as Root;
  tree.children = transformNodes(tree.children as RootContent[], rules, context);

  return processor
    .stringify(tree)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeLLMBody(content?: string): string {
  return normalizeLLMBodyWithRules(content, activeRules);
}

// 모듈 로드가 아니라 첫 호출에 시작한다. 이 모듈은 규칙 단위 테스트도 import하는데,
// 모듈 스코프에서 발사하면 그 테스트 전부가 Sanity를 찌르게 된다.
let rulesInitPromise: Promise<unknown> | null = null;

export async function ensureRulesReady(): Promise<void> {
  rulesInitPromise ??= Promise.all(activeRules.map((rule) => rule.init?.()));
  await rulesInitPromise;
}
