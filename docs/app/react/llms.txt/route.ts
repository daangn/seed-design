import { baseUrl } from "@/app/metadata";
import type { LLMPage } from "@/app/_llms/types";
import { getDisplayTitle, sectionOverviewLine, sortCategories } from "@/app/_llms/utils";
import { getReactSource } from "@/app/source";

export const revalidate = false;

const categoryOrder = [
  "getting-started",
  "components",
  "stackflow",
  "developer-tools",
  "patterns",
  "migration",
  "updates",
];

const categoryDescriptions: Record<string, string> = {
  components: "React 컴포넌트 API 및 사용법",
  "getting-started": "설치 및 시작 가이드",
  stackflow: "Stackflow 네이티브 네비게이션 연동",
  "developer-tools": "Codemods, Figma 연동 등 개발 도구",
  migration: "버전 마이그레이션 가이드",
  updates: "업데이트 및 변경사항",
  patterns: "사용 패턴 및 모범 사례",
};

export async function GET() {
  const reactSource = await getReactSource();
  const pages = reactSource.getPages();

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
          const llmsUrl = new URL(`/llms/react/${slugsWithExt.join("/")}`, baseUrl);
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

  return new Response(`# SEED React - LLM Reference

React 컴포넌트 라이브러리 문서입니다.

## Quick Access
${sectionOverviewLine("react", pages, baseUrl)}

## Categories

${categoryList}
`);
}
