import { reactSource } from "@/app/source";
import { processContent } from "@/app/react/_llms/process-content";
import { getSourceUrl } from "@/app/react/_llms/url";
export const revalidate = false;
export function generateStaticParams() {
  return reactSource
    .getPages()
    .filter((page) => page.slugs.length > 0)
    .map((page) => ({
      slug: page.slugs.map((slug, i) => (i === page.slugs.length - 1 ? `${slug}.txt` : slug)),
    }));
}
export async function GET(_: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = reactSource.getPage(
    slug.map((part, i) => (i === slug.length - 1 ? part.replace(/\.txt$/, "") : part)),
  );
  if (!page) return new Response("Not found", { status: 404 });
  const processed = await processContent(page.path, (await page.data.getText("raw")) || "");
  return new Response(
    `# ${page.data.title}\n\nURL: ${page.url}\nSource: ${getSourceUrl(page.path)}\n\n${page.data.description ?? ""}\n\n${processed}`,
  );
}
