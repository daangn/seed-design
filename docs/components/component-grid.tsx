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

async function getCoverImageSrc(nodeId: string): Promise<string | undefined> {
  if (!env.figmaFileKey || !client) return undefined;

  try {
    const urls = await fetchFigmaImageUrls({
      client,
      fileKey: env.figmaFileKey,
      nodeIds: [nodeId],
      options: {
        scale: 3,
      },
    });

    return getImageUrl(urls, nodeId);
  } catch (error) {
    console.warn(
      `[component-grid] Failed to fetch cover image for Figma node ${nodeId}; using default card image. ${getErrorMessage(error)}`,
    );

    return undefined;
  }
}

function getImageUrl(urls: Map<string, string>, nodeId: string): string | undefined {
  const url = urls.get(nodeId);
  if (!url) {
    console.warn(
      `[component-grid] Missing cover image URL for Figma node ${nodeId}; using default card image.`,
    );
  }

  return url;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  return String(error);
}

function getCategoryFromPath(path: string): string | null {
  const match = path.match(/components\/\(([^)]+)\)\//);
  if (!match) return null;

  return match[1].charAt(0).toUpperCase() + match[1].slice(1);
}

export async function ComponentGrid() {
  const allPages = docsSource.getPages();

  const categorizedPages = new Map<string, typeof allPages>();

  for (const page of allPages) {
    if (!page.url.startsWith("/docs/components/")) continue;
    if (page.data.deprecated) continue;

    const category = getCategoryFromPath(page.path);

    if (!category) continue;

    if (!categorizedPages.has(category)) {
      categorizedPages.set(category, []);
    }

    categorizedPages.get(category)!.push(page);
  }

  for (const pages of categorizedPages.values()) {
    pages.sort((a, b) => a.data.title.localeCompare(b.data.title));
  }

  const sortedCategories = Array.from(categorizedPages.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div className="space-y-10 pb-10">
      {sortedCategories.map(([category, pages]) => (
        <section key={category}>
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose items-stretch">
            {pages.map(async (page) => {
              const coverImageSrc = page.data.coverImageFigmaId
                ? await getCoverImageSrc(page.data.coverImageFigmaId)
                : undefined;

              return (
                <li key={page.url}>
                  <ComponentCard
                    className="h-full"
                    coverImageSrc={coverImageSrc}
                    title={page.data.title}
                    description={page.data.description}
                    href={page.url}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
