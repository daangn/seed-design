import type { Root, RootContent } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { activeRules } from "./rules";
import type { Rule, RuleContext } from "./rules/types";

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

function isMdxJsxFlowElement(node: RootContent): node is MdxJsxFlowElement {
  return node.type === "mdxJsxFlowElement";
}

function isMdxJsxAttribute(
  attribute: MdxJsxFlowElement["attributes"][number],
): attribute is MdxJsxAttribute {
  return attribute.type === "mdxJsxAttribute";
}

export function getStringAttribute(node: MdxJsxFlowElement, name: string): string | undefined {
  for (const attribute of node.attributes) {
    if (!isMdxJsxAttribute(attribute) || attribute.name !== name) continue;
    if (typeof attribute.value === "string") return attribute.value;
  }

  return undefined;
}

function hasChildren(node: RootContent): node is RootContent & { children: RootContent[] } {
  return "children" in node && Array.isArray(node.children);
}

/*
  비동기 rule의 결과를 트리 전체에서 미리 수집합니다.
  재귀 async 호출을 하나의 await로 줄여 Next.js AsyncLocalStorage Map 폭발을 방지합니다. (Map maximum size exceeded 에러)
*/
async function collectAsyncResults(
  nodes: RootContent[],
  rules: Rule[],
  context: RuleContext,
  cache: Map<MdxJsxFlowElement, RootContent[]>,
): Promise<void> {
  const promises: Promise<void>[] = [];

  function walk(nodes: RootContent[]): void {
    for (const node of nodes) {
      if (isMdxJsxFlowElement(node)) {
        const matchedRule = rules.find((rule) => rule.match(node));
        if (matchedRule) {
          const result = matchedRule.transform(node, context);
          if (result instanceof Promise) {
            promises.push(
              result
                .then((r) => cache.set(node, r))
                .catch(() => cache.set(node, [node]))
                .then(() => {}),
            );
          } else {
            cache.set(node, result);
          }
          continue;
        }
      }
      if (hasChildren(node)) walk(node.children);
    }
  }

  walk(nodes);
  await Promise.all(promises);
}

/*
  async 결과가 캐시된 상태에서 동기적으로 트리를 변환합니다.
*/
function transformNodesSync(
  nodes: RootContent[],
  rules: Rule[],
  context: RuleContext,
  cache: Map<MdxJsxFlowElement, RootContent[]>,
): RootContent[] {
  const transformed: RootContent[] = [];

  for (const node of nodes) {
    if (isMdxJsxFlowElement(node)) {
      const matchedRule = rules.find((rule) => rule.match(node));
      if (matchedRule) {
        try {
          const cachedOrResult = cache.get(node) ?? matchedRule.transform(node, context);
          const nextNodes = cachedOrResult instanceof Promise ? [node] : cachedOrResult;
          transformed.push(...transformNodesSync(nextNodes, rules, context, cache));
        } catch {
          transformed.push(node);
        }
        continue;
      }
    }

    if (hasChildren(node)) {
      transformed.push({
        ...node,
        children: transformNodesSync(node.children, rules, context, cache),
      } as RootContent);
      continue;
    }

    transformed.push(node);
  }

  return transformed;
}

export async function normalizeLLMBodyWithRules(
  content: string | undefined,
  rules: Rule[],
): Promise<string> {
  if (!content) return "";

  const context: RuleContext = {
    getStringAttribute,
    normalizeCodeIndent,
  };

  const tree = processor.parse(content) as Root;

  // 1단계: async rule 결과를 한 번의 await로 모두 수집
  const cache = new Map<MdxJsxFlowElement, RootContent[]>();
  await collectAsyncResults(tree.children as RootContent[], rules, context, cache);

  // 2단계: 캐시된 결과로 동기 변환
  tree.children = transformNodesSync(tree.children as RootContent[], rules, context, cache);

  return processor
    .stringify(tree)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function normalizeLLMBody(content?: string): Promise<string> {
  return normalizeLLMBodyWithRules(content, activeRules);
}
