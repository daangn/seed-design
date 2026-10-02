import { REACT_ARCHIVE_VERSION } from "@/lib/docs-archive";
import { getDocsSource } from "@/app/sources/docs-source";
import { ComponentCard } from "@/components/component-card";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
} from "@/components/figma-image/fetch-figma-image-urls";

export async function ComponentGrid() {
  const offline = process.env.SEED_DOCS_OFFLINE === "1" || !!REACT_ARCHIVE_VERSION;
  const client = offline ? undefined : createFigmaClient(process.env.FIGMA_PERSONAL_ACCESS_TOKEN!);
  const source = await getDocsSource();
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
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-10 not-prose items-stretch">
      {componentPages.map(async (page) => {
        return (
          <li key={page.url}>
            <ComponentCard
              className="h-full"
              {...(client &&
                page.data.coverImageFigmaId && {
                  coverImageSrc: (
                    await fetchFigmaImageUrls({
                      client,
                      fileKey: process.env.FIGMA_FILE_KEY!,
                      nodeIds: [page.data.coverImageFigmaId],
                      options: {
                        scale: 3,
                      },
                    })
                  ).get(page.data.coverImageFigmaId),
                })}
              title={page.data.title}
              description={page.data.description}
              href={page.url}
            />
          </li>
        );
      })}
    </ul>
  );
}
