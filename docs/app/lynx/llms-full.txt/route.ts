import { getLLMTextForFullCompilation } from "@/app/_llms/get-llm-text";
import { shouldIncludeInFullText } from "@/app/_llms/config";
import type { LLMPage } from "@/app/_llms/types";
import { getLynxSource } from "@/app/sources/lynx-source";

export const revalidate = false;

export async function GET() {
  const lynxSource = await getLynxSource();
  const pages = (lynxSource.getPages() as LLMPage[])
    .filter((page) => shouldIncludeInFullText("lynx", page.path))
    .sort((a, b) => a.path.localeCompare(b.path));

  const results = await Promise.all(pages.map(getLLMTextForFullCompilation));

  return new Response(results.join("\n\n---\n\n"));
}
