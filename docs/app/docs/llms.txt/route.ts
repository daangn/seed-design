import { baseUrl } from "@/app/metadata";
import type { LLMPage } from "@/app/_llms/types";
import { docsSource } from "@/app/source";

export const revalidate = false;

const categoryOrder = ["foundation", "components", "guidelines", "migration", "resources"];

const categoryDescriptions: Record<string, string> = {
  components: "컴포넌트 디자인 가이드라인",
  foundation: "색상, 타이포그래피, 간격 등 기초 토큰",
  guidelines: "디자인 가이드라인 및 원칙",
  migration: "마이그레이션 가이드",
  resources: "디자인 리소스",
};

function getDisplayTitle(page: LLMPage, categoryPages: LLMPage[]): string {
  const title = page.data.title;
  const duplicates = categoryPages.filter((p) => p.data.title === title);
  if (duplicates.length <= 1) return title;

  const parentSlug = page.slugs.length >= 2 ? page.slugs[page.slugs.length - 2] : null;
  if (parentSlug) {
    const label = parentSlug.charAt(0).toUpperCase() + parentSlug.slice(1);
    return `${title} (${label})`;
  }
  return title;
}

export async function GET() {
  const pages = docsSource.getPages() as LLMPage[];

  const categories = new Map<string, LLMPage[]>();
  for (const page of pages) {
    if (page.slugs.length === 0) continue;
    const category = page.slugs[0];
    if (!(category in categoryDescriptions)) continue;
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(page);
  }

  const sortedCategories = categoryOrder
    .filter((c) => categories.has(c))
    .map((c) => [c, categories.get(c)!] as const);

  const categoryList = sortedCategories
    .map(([category, categoryPages]) => {
      const description = categoryDescriptions[category] ?? "";
      const pageList = categoryPages
        .map((page) => {
          const slugsWithExt = page.slugs.map((s, i) =>
            i === page.slugs.length - 1 ? `${s}.txt` : s,
          );
          const llmsUrl = new URL(`/llms/docs/${slugsWithExt.join("/")}`, baseUrl);
          const displayTitle = getDisplayTitle(page, categoryPages);
          return `- [${displayTitle}](${llmsUrl})`;
        })
        .sort()
        .join("\n");
      return `### ${category}

${description}

${pageList}`;
    })
    .join("\n\n");

  return new Response(`# SEED Design Guidelines - LLM Reference

디자인 가이드라인 문서입니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL("/docs/llms-full.txt", baseUrl)}): 모든 디자인 문서를 하나의 파일로

## Categories

${categoryList}

## Usage

개별 페이지는 /llms/docs/{path}.txt 형태로 접근할 수 있습니다.

예시:
- ${new URL("/llms/docs/components/button.txt", baseUrl)}
- ${new URL("/llms/docs/foundation/color.txt", baseUrl)}
`);
}
