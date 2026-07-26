import { highlight } from "fumadocs-core/highlight";
import { Pre } from "fumadocs-ui/components/codeblock";
import type { ReactNode } from "react";
import { SeedCodeBlock } from "./code-block";
import { CodeTabsShell, type CodeTabsShellItem } from "./code-tabs";

const shikiThemes = { light: "github-light", dark: "github-dark" } as const;

/** Highlight a code string into a Fumadocs `<Pre>` node (github-light/dark, dual-theme). */
async function highlightCode(code: string, lang: string): Promise<ReactNode> {
  return highlight(code, {
    lang,
    themes: shikiThemes,
    defaultColor: false,
    components: { pre: Pre },
  });
}

interface SeedDynamicCodeBlockProps {
  code: string;
  lang: string;
  title?: ReactNode;
  className?: string;
}

/**
 * Runtime-highlighted single code block (async server component). Keeps the same
 * github-light/dark themes as build-time MDX blocks, without Fumadocs' card chrome.
 */
export async function SeedDynamicCodeBlock({
  code,
  lang,
  title,
  className,
}: SeedDynamicCodeBlockProps) {
  const rendered = await highlightCode(code, lang);
  return (
    <SeedCodeBlock title={title} className={className}>
      {rendered}
    </SeedCodeBlock>
  );
}

export interface SeedCodeTabItem {
  value: string;
  label: string;
  code: string;
  lang: string;
}

interface SeedCodeTabsProps {
  items: SeedCodeTabItem[];
  /** Persist + sync the selected tab across sibling blocks (e.g. package managers). */
  groupId?: string;
  className?: string;
}

/**
 * Tabbed code block card (async server component). Highlights every tab server-side,
 * then hands the nodes to the client `CodeTabsShell` which renders the SEED chip tabs.
 */
export async function SeedCodeTabs({ items, groupId, className }: SeedCodeTabsProps) {
  const shellItems: CodeTabsShellItem[] = await Promise.all(
    items.map(async ({ value, label, code, lang }) => ({
      value,
      label,
      children: await highlightCode(code, lang),
    })),
  );

  return <CodeTabsShell items={shellItems} groupId={groupId} className={className} />;
}
