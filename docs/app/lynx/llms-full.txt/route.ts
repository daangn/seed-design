import { getLLMTextForFullCompilation } from "@/app/_llms/get-llm-text";
import { shouldIncludeInFullText } from "@/app/_llms/config";
import { getLynxSource } from "@/app/source";

export const revalidate = false;

export async function GET() {
  const lynxSource = await getLynxSource();
  const pages = lynxSource
    .getPages()
    .filter((page) => shouldIncludeInFullText("lynx", page.path))
    .sort((a, b) => a.path.localeCompare(b.path));

  const results = await Promise.all(pages.map(getLLMTextForFullCompilation));

  return new Response(results.join("\n\n---\n\n"));
}
