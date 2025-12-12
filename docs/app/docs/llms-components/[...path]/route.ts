import { shouldGenerateComponentLLMText } from "@/app/docs/_llms/page-filter";
import { processContent } from "@/app/docs/_llms/process-content";
import { getSourceUrl } from "@/app/docs/_llms/url";
import { source } from "@/app/source";

type StaticParams = {
  path: string[];
};

export const revalidate = false;

/**
 * This is an entry point for accessing individual component documentation.
 * Each component can be accessed through its specific endpoint.
 */
export async function generateStaticParams(): Promise<StaticParams[]> {
  const componentPageSlugs = source
    .getPages()
    .filter((page) => {
      // Include components only
      const [firstSlug] = page.slugs;
      return firstSlug === "components";
    })
    .filter(shouldGenerateComponentLLMText)
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

  return componentPageSlugs;
}

export async function GET(_: Request, { params }: { params: Promise<StaticParams> }) {
  const { path } = await params;

  const slugsExtensionRemoved = path.map((slug, index) => {
    if (index === path.length - 1) {
      return slug.replace(/\.txt$/, "");
    }

    return slug;
  });

  // Try to find in components
  const page = source.getPage(["components", ...slugsExtensionRemoved]);
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
