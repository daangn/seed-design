import { getLLMMarkdownUrl, sectionConfigs, shouldIncludeInFullText } from "@/app/_llms/config";
import { getDisplayTitle } from "@/app/_llms/utils";
import { baseUrl } from "@/app/metadata";
import { getComponentsSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const componentsSource = await getComponentsSource();
  // 섹션 인덱스와 progress-board는 sectionConfigs.excludePaths가 이미 걸러준다.
  // `(deprecated)`는 라우트 그룹이라 slug에 안 들어간다 — frontmatter로만 구분된다.
  const pages = componentsSource
    .getPages()
    .filter((page) => shouldIncludeInFullText("components", page.path));

  const pageList = pages
    .sort((a, b) => a.slugs.join("/").localeCompare(b.slugs.join("/")))
    .map((page) => {
      const displayTitle = getDisplayTitle(page, pages);
      const llmsUrl = new URL(getLLMMarkdownUrl("components", page.slugs), baseUrl);
      const deprecatedLabel = page.data.frontmatter.deprecated ? " (Deprecated)" : "";
      const description = page.data.description ? `: ${page.data.description}` : "";
      return `- [${displayTitle}](${llmsUrl})${deprecatedLabel}${description}`;
    })
    .join("\n");

  return new Response(`# SEED Components - LLM Reference

${sectionConfigs.components.description}

## Components

${pageList}

## Related Sections

- [Foundations](${new URL("/foundations/llms.txt", baseUrl)}): 색상, 타이포그래피 등 디자인 파운데이션
- [React Library](${new URL("/react/llms.txt", baseUrl)}): React 컴포넌트 구현 및 API 레퍼런스
`);
}
