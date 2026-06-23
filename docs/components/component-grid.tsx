import { docsSource } from "@/app/source";
import { ComponentCard } from "@/components/component-card";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
} from "@/components/figma-image/fetch-figma-image-urls";
import { env } from "@/app/env";

const client = env.figmaPersonalAccessToken
  ? createFigmaClient(env.figmaPersonalAccessToken)
  : undefined;

function requireImageUrl(urls: Map<string, string>, nodeId: string): string {
  const url = urls.get(nodeId);
  if (!url) throw new Error(`[component-grid] Failed to get image URL for Figma node: ${nodeId}`);
  return url;
}

export async function ComponentGrid() {
  const pages = docsSource
    .getPages()
    .filter((page) => page.url.startsWith("/docs/components/") && !page.data.deprecated)
    .sort((a, b) => a.data.title.localeCompare(b.data.title));

  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose items-stretch pb-10">
      {pages.map(async (page) => (
        <li key={page.url}>
          <ComponentCard
            className="h-full"
            {...(page.data.coverImageFigmaId &&
              env.figmaFileKey &&
              client && {
                coverImageSrc: requireImageUrl(
                  await fetchFigmaImageUrls({
                    client,
                    fileKey: env.figmaFileKey,
                    nodeIds: [page.data.coverImageFigmaId],
                    options: {
                      scale: 3,
                    },
                  }),
                  page.data.coverImageFigmaId,
                ),
              })}
            title={page.data.title}
            description={page.data.description}
            href={page.url}
          />
        </li>
      ))}
    </ul>
  );
}
