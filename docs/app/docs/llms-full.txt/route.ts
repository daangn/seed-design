import { getLLMTextForFullCompilation } from "@/app/_llms/get-llm-text";
import { shouldIncludeInFullText } from "@/app/_llms/config";
import type { LLMPage } from "@/app/_llms/types";
import { docsSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = (docsSource.getPages() as LLMPage[])
    .filter((page) => shouldIncludeInFullText("docs", page.path))
    .sort((a, b) => a.path.localeCompare(b.path));

  const results = await Promise.all(pages.map(getLLMTextForFullCompilation));

  return new Response(results.join("\n\n---\n\n"));
}
