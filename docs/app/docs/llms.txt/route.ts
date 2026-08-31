import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { getDisplayTitle } from "@/app/_llms/utils";
import { baseUrl } from "@/app/metadata";
import { getDocsSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const docsSource = await getDocsSource();
  const pages = docsSource.getPages();

  const pageList = pages
    .sort((a, b) => a.slugs.join("/").localeCompare(b.slugs.join("/")))
    .map((page) => {
      const displayTitle = getDisplayTitle(page, pages);
      const llmsUrl = new URL(getLLMMarkdownUrl("docs", page.slugs), baseUrl);
      const deprecatedLabel = page.data.frontmatter.deprecated ? " (Deprecated)" : "";
      const description = page.data.description ? `: ${page.data.description}` : "";
      return `- [${displayTitle}](${llmsUrl})${deprecatedLabel}${description}`;
    })
    .join("\n");

  return new Response(`# SEED Guidelines - LLM Reference

마이그레이션 등 디자인 참고 문서입니다.

## Documents

${pageList}

## Related Sections

- [Foundations](${new URL("/foundations/llms.txt", baseUrl)}): 색상, 타이포그래피 등 디자인 파운데이션
- [Components](${new URL("/components/llms.txt", baseUrl)}): 컴포넌트 디자인 스펙
`);
}
