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
        </section>
      ))}
    </div>
  );
}
