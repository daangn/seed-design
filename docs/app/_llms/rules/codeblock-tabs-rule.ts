import type { Code, List, ListItem, Paragraph, RootContent } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Rule, RuleContext } from "./types";

interface PackageInstallTab {
  command: string;
  value: string;
}

const preferredPackageManagerOrder = ["npm", "pnpm", "yarn", "bun"] as const;

function isCodeBlockTab(node: RootContent): node is MdxJsxFlowElement {
  return node.type === "mdxJsxFlowElement" && node.name === "CodeBlockTab";
}

function extractPackageInstallTabs(node: MdxJsxFlowElement, context: RuleContext): PackageInstallTab[] {
  const tabs: PackageInstallTab[] = [];

  for (const child of node.children as RootContent[]) {
    if (!isCodeBlockTab(child)) continue;

    const value = context.getStringAttribute(child, "value");
    const codeNode = child.children.find((inner): inner is Code => inner.type === "code");

    if (!value || !codeNode) continue;

    tabs.push({
      command: context.normalizeCodeIndent(codeNode.value),
      value,
    });
  }

  return tabs;
}

function sortPackageInstallTabs(tabs: PackageInstallTab[]): PackageInstallTab[] {
  const knownValueSet = new Set(preferredPackageManagerOrder);
  const known = preferredPackageManagerOrder
    .map((value) => tabs.find((tab) => tab.value === value))
    .filter((tab): tab is PackageInstallTab => Boolean(tab));
  const unknown = tabs.filter(
    (tab) => !knownValueSet.has(tab.value as (typeof preferredPackageManagerOrder)[number]),
  );

  return [...known, ...unknown];
}

function createListItem(tab: PackageInstallTab): ListItem {
  const paragraph: Paragraph = {
    type: "paragraph",
    children: [{ type: "text", value: `${tab.value}: ${tab.command}` }],
  };

  return {
    type: "listItem",
    spread: false,
    children: [paragraph],
  };
}

function createPackageInstallList(tabs: PackageInstallTab[]): List {
  return {
    type: "list",
    ordered: false,
    spread: false,
    children: tabs.map(createListItem),
  };
}

export const codeBlockTabsRule: Rule = {
  name: "CodeBlockTabs",
  match: (node): node is MdxJsxFlowElement =>
    node.type === "mdxJsxFlowElement" && node.name === "CodeBlockTabs",
  transform: (node, context) => {
    try {
      const tabs = extractPackageInstallTabs(node, context);
      if (tabs.length === 0) return [node];

      return [createPackageInstallList(sortPackageInstallTabs(tabs))];
    } catch {
      return [node];
    }
  },
};
