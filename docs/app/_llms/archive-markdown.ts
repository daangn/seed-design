import type { Root, Text } from "mdast";
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
  // llms 룰이 설치 탭을 목록 텍스트로 바꾸므로 텍스트의 CLI 명령도 바꿉니다.
  // 추가한 `--baseUrl` URL만 이스케이프를 풀어 `https\://`로 출력되지 않게 합니다.
  const baseUrl = `https://seed-design.io${createArchivePaths(version).prefix}`;
  const escapedBaseUrlOption = `--baseUrl ${baseUrl.replace("://", "\\://")}`;
  const cliTexts = new WeakSet<Text>();
  const processor = remark()
    .data("settings", {
      handlers: {
        text: (node: Text, _, state, info) => {
          const value = state.safe(node.value, info);
          return cliTexts.has(node)
            ? value.replaceAll(escapedBaseUrlOption, `--baseUrl ${baseUrl}`)
            : value;
        },
      },
    })
    .use(remarkGfm);
  if (format === "mdx") processor.use(remarkMdx);
  processor.use(remarkArchiveLinks, version);
  processor.use(() => (tree: Root) => {
    visit(tree, "text", (node) => {
      const value = archiveCliCommands(node.value, version);
      if (value === node.value) return;
      node.value = value;
      cliTexts.add(node);
    });
  });
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
