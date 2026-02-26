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

function transformNodes(nodes: RootContent[], rules: Rule[], context: RuleContext): RootContent[] {
  const transformed: RootContent[] = [];

  for (const node of nodes) {
    if (isMdxJsxFlowElement(node)) {
      const matchedRule = rules.find((rule) => rule.match(node));
      if (matchedRule) {
        try {
          const nextNodes = matchedRule.transform(node, context);
          transformed.push(...transformNodes(nextNodes, rules, context));
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

export function normalizeLLMBodyWithRules(content: string | undefined, rules: Rule[]): string {
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

const _rulesInit = Promise.all(activeRules.filter((r) => r.init).map((r) => r.init!()));

export async function ensureRulesReady(): Promise<void> {
  await _rulesInit;
}
