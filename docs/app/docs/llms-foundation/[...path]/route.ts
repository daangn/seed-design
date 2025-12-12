import { shouldGenerateFoundationLLMText } from "@/app/docs/_llms/page-filter";
import { processContent } from "@/app/docs/_llms/process-content";
import { getSourceUrl } from "@/app/docs/_llms/url";
import { source } from "@/app/source";

type StaticParams = {
  path: string[];
};

export const revalidate = false;

/**
 * This is an entry point for accessing individual foundation documentation.
 * Each foundation topic can be accessed through its specific endpoint.
 */
export async function generateStaticParams(): Promise<StaticParams[]> {
  const foundationPageSlugs = source
    .getPages()
    .filter((page) => {
      // Include foundation only
      const [firstSlug] = page.slugs;
      return firstSlug === "foundation";
    })
    .filter(shouldGenerateFoundationLLMText)
    .map((page) => {
      // Attach .txt extension to the last slug
      const slugsExtensionAttached = page.slugs.map((slug, index) => {
        if (index === page.slugs.length - 1) return `${slug}.txt`;

        return slug;
      });

      return slugsExtensionAttached;
    })
    .filter((slugs) => slugs !== undefined)
    .map(([_firstSlug, ...restSlugs]) => ({ path: restSlugs }))
    .filter(({ path }) => path.length > 0);

  return foundationPageSlugs;
}

export async function GET(_: Request, { params }: { params: Promise<StaticParams> }) {
  const { path } = await params;

  const slugsExtensionRemoved = path.map((slug, index) => {
    if (index === path.length - 1) {
      return slug.replace(/\.txt$/, "");
    }

    return slug;
  });

  // Try to find in foundation
  const page = source.getPage(["foundation", ...slugsExtensionRemoved]);
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
