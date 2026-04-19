import { getLLMTextForFullCompilation } from "@/app/_llms/get-llm-text";
import { shouldIncludeInFullText } from "@/app/_llms/config";
import { reactSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = (reactSource.getPages())
    .filter((page) => shouldIncludeInFullText("react", page.path))
    .sort((a, b) => a.path.localeCompare(b.path));

  const pageResults = await Promise.all(
    pages.map(getLLMTextForFullCompilation),
  );

  return new Response(pageResults.join("\n\n---\n\n"));
}
