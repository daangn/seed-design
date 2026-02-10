import type { Code, ListItem, Root, RootContent } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

interface PackageInstallTab {
  code: string;
  language: string;
  value: string;
}

type FlowElementTransformer = (node: MdxJsxFlowElement) => RootContent[];

const preferredPackageManagerOrder = ["npm", "pnpm", "yarn", "bun"];

const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkStringify, {
    bullet: "-",
    fences: true,
    listItemIndent: "one",
  });

function normalizeCodeIndent(code: string): string {
  const lines = code.replace(/\r\n/g, "\n").split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  const minIndent = nonEmptyLines.reduce((min, line) => {
    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
    return Math.min(min, indent);
  }, Number.POSITIVE_INFINITY);

  if (!Number.isFinite(minIndent) || minIndent === 0) {
    return lines.join("\n").trimEnd();
  }

  return lines.map((line) => line.slice(minIndent)).join("\n").trimEnd();
}

function isMdxJsxFlowElement(node: RootContent): node is MdxJsxFlowElement {
  return node.type === "mdxJsxFlowElement";
}

function isMdxJsxAttribute(
  attribute: MdxJsxFlowElement["attributes"][number],
): attribute is MdxJsxAttribute {
  return attribute.type === "mdxJsxAttribute";
}

function getStringAttribute(node: MdxJsxFlowElement, name: string): string | undefined {
  for (const attribute of node.attributes) {
    if (!isMdxJsxAttribute(attribute) || attribute.name !== name) continue;
    if (typeof attribute.value === "string") return attribute.value;
  }

  return undefined;
}

function extractPackageInstallTabs(node: MdxJsxFlowElement): PackageInstallTab[] {
  const tabs: PackageInstallTab[] = [];

  for (const child of node.children) {
    if (child.type !== "mdxJsxFlowElement" || child.name !== "CodeBlockTab") continue;

    const value = getStringAttribute(child, "value");
    const codeNode = child.children.find((inner): inner is Code => inner.type === "code");
    if (!value || !codeNode) continue;

    tabs.push({
      code: normalizeCodeIndent(codeNode.value),
      language: codeNode.lang ?? "bash",
      value,
    });
  }

  return tabs;
}

function buildPackageInstallNodes(node: MdxJsxFlowElement): RootContent[] {
  const tabs = extractPackageInstallTabs(node);
  if (tabs.length === 0) return [];

  const primary =
    preferredPackageManagerOrder
      .map((value) => tabs.find((tab) => tab.value === value))
      .find((tab) => Boolean(tab)) ?? tabs[0];
  const alternatives = tabs.filter((tab) => tab !== primary);

  const nodes: RootContent[] = [
    {
      type: "code",
      lang: primary.language,
      value: primary.code,
    },
  ];

  if (alternatives.length === 0) return nodes;

  const listItems = alternatives.map((tab) => {
    const hasMultilineCode = tab.code.includes("\n");
    const paragraph = {
      type: "paragraph",
      children: hasMultilineCode
        ? [{ type: "text", value: `${tab.value}:` }]
        : [
            { type: "text", value: `${tab.value}: ` },
            { type: "inlineCode", value: tab.code },
          ],
    } as const;

    const listItemChildren: RootContent[] = [paragraph as RootContent];
    if (hasMultilineCode) {
      listItemChildren.push({
        type: "code",
        lang: tab.language,
        value: tab.code,
      });
    }

    return {
      type: "listItem",
      spread: hasMultilineCode,
      children: listItemChildren as ListItem["children"],
    } as ListItem;
  });

  nodes.push({
    type: "paragraph",
    children: [{ type: "text", value: "다른 패키지 매니저:" }],
  });

  nodes.push({
    type: "list",
    ordered: false,
    spread: false,
    children: listItems,
  } as RootContent);

  return nodes;
}

const flowElementTransformers: Record<string, FlowElementTransformer> = {
  ComponentExample: (node) => node.children as RootContent[],
  CodeBlockTabs: buildPackageInstallNodes,
  ManualInstallation: () => [],
};

function transformNodes(nodes: RootContent[]): RootContent[] {
  const transformed: RootContent[] = [];

  for (const node of nodes) {
    if (isMdxJsxFlowElement(node)) {
      const transformer = node.name ? flowElementTransformers[node.name] : undefined;
      if (transformer) {
        transformed.push(...transformNodes(transformer(node)));
        continue;
      }
    }

    if ("children" in node && Array.isArray(node.children)) {
      transformed.push({
        ...node,
        children: transformNodes(node.children as RootContent[]),
      } as RootContent);
      continue;
    }

    transformed.push(node);
  }

  return transformed;
}

export function normalizeLLMBody(content?: string): string {
  if (!content) return "";

  const tree = processor.parse(content) as Root;
  tree.children = transformNodes(tree.children as RootContent[]);

  return processor
    .stringify(tree)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
