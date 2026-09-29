import type { Root } from "mdast";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { createArchivePaths } from "@/lib/docs-archive";

// Only Markdown URL nodes are rewritten: installation commands and code stay verbatim.
export function archiveMarkdown(markdown: string, version: string): string {
  if (!version) return markdown;
  const processor = remark().use(remarkGfm).use(remarkArchiveLinks, version);
  return processor.processSync(markdown).toString();
}

export function remarkArchiveLinks(version: string) {
  const paths = createArchivePaths(version);
  return (tree: Root) => {
    if (!version) return;
    visit(tree, (node) => {
      if (node.type === "link" || node.type === "definition") node.url = paths.link(node.url);
      if (node.type === "image") node.url = paths.asset(node.url);
    });
  };
}
