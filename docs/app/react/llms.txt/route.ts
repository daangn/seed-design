import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { getDisplayTitle } from "@/app/_llms/utils";
import { baseUrl } from "@/app/metadata";
import { getReactSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const reactSource = await getReactSource();
  const pages = reactSource.getPages();

  // 정렬은 title이 아니라 slug 기준 — 그래야 같은 경로 아래 문서가 서로 붙어, 목록이
  // 카테고리를 선언하지 않고도 섹션의 생김새를 보여준다.
  const pageList = pages
    .sort((a, b) => a.slugs.join("/").localeCompare(b.slugs.join("/")))
    .map((page) => {
      const displayTitle = getDisplayTitle(page, pages);
      const llmsUrl = new URL(getLLMMarkdownUrl("react", page.slugs), baseUrl);
      const deprecatedLabel = page.data.frontmatter.deprecated ? " (Deprecated)" : "";
      const description = page.data.description ? `: ${page.data.description}` : "";
      return `- [${displayTitle}](${llmsUrl})${deprecatedLabel}${description}`;
    })
    .join("\n");

  return new Response(`# SEED React - LLM Reference

React 컴포넌트 라이브러리 문서입니다.

## Documents

${pageList}
`);
}
