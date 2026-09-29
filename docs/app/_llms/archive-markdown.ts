import type { Root } from "mdast";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import { createArchivePaths } from "@/lib/docs-archive";

// 링크·이미지 노드와 MDX 속성만 바꾸고, 설치 명령·코드·표현식은 유지합니다.
export function archiveMarkdown(markdown: string, version: string): string {
  if (!version) return markdown;
  const processor = remark().use(remarkGfm).use(remarkMdx).use(remarkArchiveLinks, version);
  return processor.processSync(markdown).toString();
}

export function remarkArchiveLinks(version: string) {
  const paths = createArchivePaths(version);
  return (tree: Root) => {
    if (!version) return;
    visit(tree, (node) => {
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
