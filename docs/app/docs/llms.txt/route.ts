import { baseUrl } from "@/app/metadata";
import type { LLMPage } from "@/app/_llms/types";
import { getDisplayTitle, sectionOverviewLine, sortCategories } from "@/app/_llms/utils";
import { getDocsSource } from "@/app/source";

export const revalidate = false;

// IA 개편으로 foundation/components/guidelines/resources는 각자 최상위 섹션으로 빠져나갔고
// (`/foundations`, `/components`, `/patterns`) `/docs`에는 migration만 남았다.
const categoryOrder = ["migration"];

const categoryDescriptions: Record<string, string> = {
  migration: "마이그레이션 가이드",
};

export async function GET() {
  const docsSource = await getDocsSource();
  const pages = docsSource.getPages();

  const categories = new Map<string, LLMPage[]>();
  for (const page of pages) {
    if (page.slugs.length === 0) continue;
    const category = page.slugs[0];
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(page);
  }

  const categoryList = sortCategories(categories, categoryOrder)
    .map(([category, categoryPages]) => {
      const description = categoryDescriptions[category] ?? "";
      const pageList = categoryPages
        .map((page) => {
          const slugsWithExt = page.slugs.map((s, i) =>
            i === page.slugs.length - 1 ? `${s}.txt` : s,
          );
          const llmsUrl = new URL(`/llms/docs/${slugsWithExt.join("/")}`, baseUrl);
          const displayTitle = getDisplayTitle(page, categoryPages);
          const deprecatedLabel = page.data.frontmatter.deprecated ? " (Deprecated)" : "";
          return { displayTitle, line: `- [${displayTitle}](${llmsUrl})${deprecatedLabel}` };
        })
        .sort((a, b) => a.displayTitle.localeCompare(b.displayTitle))
        .map((x) => x.line)
        .join("\n");
      return `### ${category}

${description}

${pageList}`;
    })
    .join("\n\n");

  return new Response(`# SEED Guidelines - LLM Reference

마이그레이션 등 디자인 참고 문서입니다.

## Quick Access
${sectionOverviewLine("docs", pages, baseUrl)}

## Categories

${categoryList}

## Related Sections

- [Foundations](${new URL("/foundations/llms.txt", baseUrl)}): 색상, 타이포그래피 등 디자인 파운데이션
- [Components](${new URL("/components/llms.txt", baseUrl)}): 컴포넌트 디자인 스펙
`);
}
