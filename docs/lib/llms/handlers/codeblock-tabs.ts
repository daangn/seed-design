import type { Code } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { LLMHandler } from "../types";

/** Tab order in the output, so a page's install snippet reads the same everywhere. */
const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"];

interface Tab {
  value: string;
  command: string;
}

/**
 * A fence nested inside JSX can carry the wrapper's indentation into `code.value`. That
 * prefix is layout, and pasting it in front of the command would be one more thing to
 * strip by hand.
 */
function stripSharedIndent(code: string): string {
  const lines = code.replace(/\r\n/g, "\n").split("\n");
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.length - line.trimStart().length);

  const shared = indents.length > 0 ? Math.min(...indents) : 0;
  return lines
    .map((line) => line.slice(shared))
    .join("\n")
    .trimEnd();
}

function readTabs(node: MdxJsxFlowElement): Tab[] {
  const tabs: Tab[] = [];

  for (const child of node.children) {
    if (child.type !== "mdxJsxFlowElement" || child.name !== "CodeBlockTab") continue;

    const value = child.attributes.find(
      (attribute): attribute is MdxJsxAttribute =>
        attribute.type === "mdxJsxAttribute" && attribute.name === "value",
    )?.value;
    const code = child.children.find((inner): inner is Code => inner.type === "code");

    // A tab with no label or no fence has nothing a reader could run.
    if (typeof value !== "string" || !value || !code) continue;

    tabs.push({ value, command: stripSharedIndent(code.value) });
  }

  return tabs;
}

const sortTabs = (tabs: Tab[]) => [
  ...PACKAGE_MANAGERS.map((name) => tabs.find((tab) => tab.value === name)).filter(
    (tab) => tab !== undefined,
  ),
  ...tabs.filter((tab) => !PACKAGE_MANAGERS.includes(tab.value)),
];

/**
 * `<CodeBlockTabs>` is one command repeated per package manager, and the tab strip that
 * picks between them is a UI affordance llms.txt has no way to offer. It flattens to a
 * list of `manager: command` lines, in `PACKAGE_MANAGERS` order.
 */
export const codeBlockTabsHandler: LLMHandler = {
  names: ["CodeBlockTabs"],
  render: (node) => {
    if (node.type !== "mdxJsxFlowElement") return undefined;

    const tabs = sortTabs(readTabs(node));
    if (tabs.length === 0) return undefined;

    // A multi-line command has to keep its continuation lines indented under the marker,
    // or everything after the first line reads as a sibling of the list.
    return tabs.map((tab) => `- ${tab.value}: ${tab.command.replace(/\n/g, "\n  ")}`).join("\n");
  },
};
