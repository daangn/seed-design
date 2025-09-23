import { processContent } from "@/app/breeze/_llms/process-content";
import { getSourceUrl } from "@/app/breeze/_llms/url";
import { breezeSource } from "@/app/source";

type StaticParams = {
  path: string[];
};

export const revalidate = false;

/**
 * This is an entry point for accessing individual breeze component documentation.
 * Each breeze component can be accessed through its specific endpoint.
 */
export async function generateStaticParams(): Promise<StaticParams[]> {
  const breezePageSlugs = breezeSource
    .getPages()
    .map((page) => {
      // Skip empty slugs or root pages
      if (page.slugs.length === 0) return null;

      // Attach .txt extension to the last slug
      const slugsExtensionAttached = page.slugs.map((slug, index) => {
        if (index === page.slugs.length - 1) return `${slug}.txt`;
        return slug;
      });

      return slugsExtensionAttached;
    })
    .filter((slugs): slugs is string[] => slugs !== null)
    .map((slugs) => ({ path: slugs }));

  return breezePageSlugs;
}

export async function GET(_: Request, { params }: { params: Promise<StaticParams> }) {
  const { path } = await params;

  const slugsExtensionRemoved = path.map((slug, index) => {
    if (index === path.length - 1) {
      return slug.replace(/\.txt$/, "");
    }
    return slug;
  });

  const page = breezeSource.getPage(slugsExtensionRemoved);
  if (!page) throw new Error("Page not found");

  const rawContent = await page.data.getText("raw");
  const processed = await processContent(page.path, rawContent || "");

  const response = `# ${page.data.title}

URL: ${page.url}
Source: ${getSourceUrl(page.path)}

${page.data.description ?? ""}

${processed}`;

  return new Response(response);
}
