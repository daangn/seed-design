import { baseUrl } from "@/app/metadata";
import type { LLMPage } from "@/app/_llms/types";
import { sectionOverviewLine, sortCategories } from "@/app/_llms/utils";
import { getAiIntegrationSource } from "@/app/source";

export const revalidate = false;

const categoryOrder = ["docs-mcp", "figma-mcp", "cli"];

const categoryDescriptions: Record<string, string> = {
  "docs-mcp": "SEED MCP 서버 연동",
  "figma-mcp": "Figma MCP 서버 연동",
  cli: "CLI 스킬 및 도구",
};

export async function GET() {
  const aiIntegrationSource = await getAiIntegrationSource();
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

  const categoryList = sortCategories(categories, categoryOrder)
    .map(([category, categoryPages]) => {
      const description = categoryDescriptions[category] ?? "";
      const pageList = categoryPages
        .map((page) => {
          const slugsWithExt = page.slugs.map((s, i) =>
            i === page.slugs.length - 1 ? `${s}.txt` : s,
          );
          const llmsUrl = new URL(`/llms/ai-integration/${slugsWithExt.join("/")}`, baseUrl);
          return `- [${page.data.title}](${llmsUrl})`;
        })
        .sort()
        .join("\n");
      return `### ${category}

${description}

${pageList}`;
    })
    .join("\n\n");

  return new Response(`# SEED AI Integration - LLM Reference

AI 도구 연동 가이드 문서입니다.

## Quick Access
${sectionOverviewLine("ai-integration", pages, baseUrl)}

## Categories

${categoryList}
`);
}
