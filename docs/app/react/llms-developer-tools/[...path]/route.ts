import { processContent } from "@/app/react/_llms/process-content";
import { getSourceUrl } from "@/app/react/_llms/url";
import { reactSource } from "@/app/source";

type StaticParams = {
  path: string[];
};

export const revalidate = false;

/**
 * Generate static params for developer tools documentation pages.
 */
export async function generateStaticParams(): Promise<StaticParams[]> {
  const developerToolsPageSlugs = reactSource
    .getPages()
    .filter((page) => {
      const [firstSlug] = page.slugs;
      return firstSlug === "developer-tools";
    })
    .map((page) => {
      // Attach .txt extension to the last slug
      const slugsExtensionAttached = page.slugs.map((slug, index) => {
        if (index === page.slugs.length - 1) return `${slug}.txt`;
        return slug;
      });

      return slugsExtensionAttached;
    })
    .filter((slugs) => slugs !== undefined)
    .map(([_firstSlug, ...restSlugs]) => ({ path: restSlugs }));

  return developerToolsPageSlugs;
}

export async function GET(_: Request, { params }: { params: Promise<StaticParams> }) {
  const { path } = await params;

  const slugsExtensionRemoved = path.map((slug, index) => {
    if (index === path.length - 1) {
      return slug.replace(/\.txt$/, "");
    }
    return slug;
  });

  // Try to find in developer-tools
  const page = reactSource.getPage(["developer-tools", ...slugsExtensionRemoved]);
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
