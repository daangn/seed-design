import { getLLMTextForFullCompilation } from "@/app/_llms/get-llm-text";
import { shouldIncludeInFullText } from "@/app/_llms/config";
import { lynxSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const pages = (lynxSource.getPages())
    .filter((page) => shouldIncludeInFullText("lynx", page.path))
    .sort((a, b) => a.path.localeCompare(b.path));

  const allPages = lynxSource.getPages();
  const results = await Promise.all(
    pages.map((page) => getLLMTextForFullCompilation(page, "lynx", allPages)),
  );

  return new Response(results.join("\n\n---\n\n"));
}
