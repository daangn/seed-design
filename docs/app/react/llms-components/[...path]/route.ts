import { processContent } from "@/app/react/_llms/process-content";
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
    .map(({ slugs }) => {
      const [firstSlug, secondSlug] = slugs;

      // include components/** but exclude components/concepts
      if (firstSlug !== "components" || secondSlug === "concepts") return undefined;

      // Attach .txt extension to the last slug
      const slugsExtensionAttached = slugs.map((slug, index) => {
        if (index === slugs.length - 1) return `${slug}.txt`;

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

  const response = `file: ${page.path}

# ${page.data.title}

${page.data.description ?? ""}

${processed}`;

  return new Response(response);
}
