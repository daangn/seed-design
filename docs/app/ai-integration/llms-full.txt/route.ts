import { getLLMTextForFullCompilation } from "@/app/_llms/get-llm-text";
import { shouldIncludeInFullText } from "@/app/_llms/config";
import { aiIntegrationSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = (aiIntegrationSource.getPages())
    .filter((page) => shouldIncludeInFullText("ai-integration", page.path))
    .sort((a, b) => a.path.localeCompare(b.path));

  const allPages = aiIntegrationSource.getPages();
  const results = await Promise.all(
    pages.map((page) => getLLMTextForFullCompilation(page, "ai-integration", allPages)),
  );

  return new Response(results.join("\n\n---\n\n"));
}
