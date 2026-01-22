import { baseUrl } from "@/app/metadata";
import type { LLMPage } from "@/app/_llms/types";
import { reactSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = reactSource.getPages() as LLMPage[];

  const categories = new Map<string, LLMPage[]>();
  for (const page of pages) {
    if (page.slugs.length === 0) continue;
    const category = page.slugs[0];
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(page);
  }

  const categoryDescriptions: Record<string, string> = {
    components: "React 컴포넌트 API 및 사용법",
    "getting-started": "설치 및 시작 가이드",
    stackflow: "Stackflow 네이티브 네비게이션 연동",
    "developer-tools": "Codemods, Figma 연동 등 개발 도구",
    migration: "버전 마이그레이션 가이드",
    updates: "업데이트 및 변경사항",
    patterns: "사용 패턴 및 모범 사례",
  };

  const categoryList = Array.from(categories.entries())
    .map(([category, categoryPages]) => {
      const description = categoryDescriptions[category] ?? "";
      const pageList = categoryPages
        .map((page) => {
          const slugsWithExt = page.slugs.map((s, i) =>
            i === page.slugs.length - 1 ? `${s}.txt` : s,
          );
          const llmsUrl = new URL(`/llms/react/${slugsWithExt.join("/")}`, baseUrl);
          return `  - [${page.data.title}](${llmsUrl})`;
        })
        .sort()
        .join("\n");
      return `### ${category}

${description}

${pageList}`;
    })
    .join("\n\n");

  return new Response(`# SEED Design React - LLM Reference

React 컴포넌트 라이브러리 문서입니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL("/react/llms-full.txt", baseUrl)}): 모든 React 문서를 하나의 파일로

## Categories

${categoryList}

## Usage

개별 페이지는 /llms/react/{path}.txt 형태로 접근할 수 있습니다.

예시:
- ${new URL("/llms/react/components/button.txt", baseUrl)}
- ${new URL("/llms/react/getting-started/installation.txt", baseUrl)}
`);
}
