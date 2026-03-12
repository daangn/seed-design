import { baseUrl } from "@/app/metadata";
import type { LLMPage } from "@/app/_llms/types";
import { aiIntegrationSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = aiIntegrationSource.getPages() as LLMPage[];

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
    "docs-mcp": "SEED Design MCP 서버 연동",
    "figma-mcp": "Figma MCP 서버 연동",
    cli: "CLI 스킬 및 도구",
  };

  const categoryList = Array.from(categories.entries())
    .map(([category, categoryPages]) => {
      const description = categoryDescriptions[category] ?? "";
      const pageList = categoryPages
        .map((page) => {
          const slugsWithExt = page.slugs.map((s, i) =>
            i === page.slugs.length - 1 ? `${s}.txt` : s,
          );
          const llmsUrl = new URL(`/llms/ai-integration/${slugsWithExt.join("/")}`, baseUrl);
          return `  - [${page.data.title}](${llmsUrl})`;
        })
        .sort()
        .join("\n");
      return `### ${category}

${description}

${pageList}`;
    })
    .join("\n\n");

  return new Response(`# SEED Design AI Integration - LLM Reference

AI 도구 연동 가이드 문서입니다.

## Quick Access

- [전체 문서 (llms-full.txt)](${new URL("/ai-integration/llms-full.txt", baseUrl)}): 모든 AI Integration 문서를 하나의 파일로

## Categories

${categoryList}

## Usage

개별 페이지는 /llms/ai-integration/{path}.txt 형태로 접근할 수 있습니다.

예시:
- ${new URL("/llms/ai-integration/docs-mcp.txt", baseUrl)}
- ${new URL("/llms/ai-integration/figma-mcp.txt", baseUrl)}
`);
}
