import { shouldGenerateLLMFriendlyText } from "@/app/react/_llms/page-filter";
import { processContent } from "@/app/react/_llms/process-content";
import { getSourceUrl } from "@/app/react/_llms/url";
import { reactSource } from "@/app/source";
import { notFound } from "next/navigation";

type StaticParams = {
  path: string[];
};

export const revalidate = false;

/**
 * This is an entry point for accessing individual component documentation.
 * Each component can be accessed through its specific endpoint.
 */
export async function generateStaticParams(): Promise<StaticParams[]> {
  const componentPageSlugs = reactSource
    .getPages()
    .filter(shouldGenerateLLMFriendlyText)
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

  const page = reactSource.getPage(["components", ...slugsExtensionRemoved]);
  if (!page) return notFound();

  const processed = await processContent(page.path, page.data.content);

  const response = `# ${page.data.title}

URL: ${page.url}
Source: ${getSourceUrl(page.path)}

${page.data.description ?? ""}

${processed}`;

  return new Response(response);
}
