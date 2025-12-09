import { source } from "@/app/source";
import { ComponentCard } from "@/components/component-card";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
} from "@/components/figma-image/fetch-figma-image-urls";

const client = createFigmaClient(process.env.FIGMA_PERSONAL_ACCESS_TOKEN!);

export function ComponentGrid() {
  // Get all component pages
  const allPages = source.getPages();

  const componentPages = allPages
    .filter((page) => {
      // Only include pages under /docs/components/
      if (!page.url.startsWith("/docs/components/")) return false;

      if (page.data.deprecated) return false;

      return true;
    })
    .sort((a, b) => {
      // Sort alphabetically by title
      const titleA = a.data.title;
      const titleB = b.data.title;

      return titleA.localeCompare(titleB);
    });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-10 not-prose">
      {componentPages.map(async (page) => {
        return (
          <ComponentCard
            {...(page.data.coverImageFigmaId && {
              coverImageSrc: (
                await fetchFigmaImageUrls({
                  client,
                  fileKey: process.env.FIGMA_FILE_KEY!,
                  nodeIds: [page.data.coverImageFigmaId],
                })
              ).get(page.data.coverImageFigmaId),
            })}
            key={page.url}
            title={page.data.title}
            description={page.data.description}
            href={page.url}
          />
        );
      })}
    </div>
  );
}
