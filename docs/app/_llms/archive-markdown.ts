import type { Root } from "mdast";
import { archiveCliCommands } from "@/lib/archive-cli-commands";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import { createArchivePaths } from "@/lib/docs-archive";

// 링크·이미지와 registry를 읽는 CLI 명령만 보관 경로에 맞춥니다.
export function archiveMarkdown(
  markdown: string,
  version: string,
  format: "markdown" | "mdx" = "markdown",
): string {
  if (!version) return markdown;
  const processor = remark().use(remarkGfm);
  if (format === "mdx") processor.use(remarkMdx);
  processor.use(remarkArchiveLinks, version);
  return processor.processSync(markdown).toString();
}

export function remarkArchiveLinks(version: string) {
  const paths = createArchivePaths(version);
  return (tree: Root) => {
    if (!version) return;
    visit(tree, (node) => {
      if (node.type === "code" || node.type === "inlineCode")
        node.value = archiveCliCommands(node.value, version);
      if (node.type === "link" || node.type === "definition") node.url = paths.link(node.url);
      if (node.type === "image") node.url = paths.asset(node.url);
      if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
        for (const attribute of node.attributes) {
          if (attribute.type !== "mdxJsxAttribute" || typeof attribute.value !== "string") continue;
          if (attribute.name === "href") attribute.value = paths.link(attribute.value);
          if (attribute.name === "src") attribute.value = paths.asset(attribute.value);
        }
      }
    });
  };
}
