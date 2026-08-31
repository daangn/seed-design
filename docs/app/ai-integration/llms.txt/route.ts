import { getLLMMarkdownUrl } from "@/app/_llms/config";
import { getDisplayTitle } from "@/app/_llms/utils";
import { baseUrl } from "@/app/metadata";
import { getAiIntegrationSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const aiIntegrationSource = await getAiIntegrationSource();
  const pages = aiIntegrationSource.getPages();

  const pageList = pages
    .sort((a, b) => a.slugs.join("/").localeCompare(b.slugs.join("/")))
    .map((page) => {
      const displayTitle = getDisplayTitle(page, pages);
      const llmsUrl = new URL(getLLMMarkdownUrl("ai-integration", page.slugs), baseUrl);
      const description = page.data.description ? `: ${page.data.description}` : "";
      return `- [${displayTitle}](${llmsUrl})${description}`;
    })
    .join("\n");

  return new Response(`# SEED AI Integration - LLM Reference

AI 도구 연동 가이드 문서입니다.

## Documents

${pageList}
`);
}
