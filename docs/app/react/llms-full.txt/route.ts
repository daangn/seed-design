import { getLLMTextForFullCompilation } from "@/app/_llms/get-llm-text";
import { shouldIncludeInFullText } from "@/app/_llms/config";
import type { LLMPage } from "@/app/_llms/types";
import { getReactSource } from "@/app/sources/react-source";

export const revalidate = false;

export async function GET() {
  const reactSource = await getReactSource();
  const pages = (reactSource.getPages() as LLMPage[])
    .filter((page) => shouldIncludeInFullText("react", page.path))
    .sort((a, b) => a.path.localeCompare(b.path));

  const results = await Promise.all(pages.map(getLLMTextForFullCompilation));

  return new Response(results.join("\n\n---\n\n"));
}
