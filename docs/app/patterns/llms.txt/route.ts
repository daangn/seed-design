import { getLLMMarkdownUrl, sectionConfigs, shouldIncludeInFullText } from "@/app/_llms/config";
import { getDisplayTitle } from "@/app/_llms/utils";
import { baseUrl } from "@/app/metadata";
import { patternsSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  // 섹션 인덱스는 sectionConfigs.excludePaths가 이미 걸러준다.
  const pages = patternsSource
    .getPages()
    .filter((page) => shouldIncludeInFullText("patterns", page.path));

  const pageList = pages
    .sort((a, b) => a.slugs.join("/").localeCompare(b.slugs.join("/")))
    .map((page) => {
      const displayTitle = getDisplayTitle(page, pages);
      const llmsUrl = new URL(getLLMMarkdownUrl("patterns", page.slugs), baseUrl);
      const description = page.data.description ? `: ${page.data.description}` : "";
      return `- [${displayTitle}](${llmsUrl})${description}`;
    })
    .join("\n");

  return new Response(`# SEED Patterns - LLM Reference

${sectionConfigs.patterns.description}

## Documents

${pageList}

## Related Sections

- [Components](${new URL("/components/llms.txt", baseUrl)}): 컴포넌트 디자인 스펙
- [Foundations](${new URL("/foundations/llms.txt", baseUrl)}): 색상, 타이포그래피 등 디자인 파운데이션
`);
}
