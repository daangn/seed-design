import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@/app/env";
import { collectFigmaImageIdsFromMdx } from "@/components/figma-image/collect-figma-image-ids";
import {
  createFigmaClient,
  fetchFigmaImageUrls,
} from "@/components/figma-image/fetch-figma-image-urls";
import {
  createFigmaImageManifest,
  getFigmaImageCacheKey,
  writeFigmaImageManifest,
} from "@/components/figma-image/figma-image-manifest";

const FIGMA_IMAGE_OPTIONS = { format: "png", scale: 2 } as const;
const MAX_IDS_PER_REQUEST = 50;

async function collectMdxPaths(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectMdxPaths(entryPath);
      return entry.name.endsWith(".mdx") ? [entryPath] : [];
    }),
  );

  return nested.flat();
}

async function main() {
  const startedAt = performance.now();
  const contentDir = path.resolve(process.cwd(), "content");
  const mdxPaths = await collectMdxPaths(contentDir);
  const sources = await Promise.all(mdxPaths.map((filePath) => readFile(filePath, "utf-8")));
  const nodeIds = [...new Set(sources.flatMap(collectFigmaImageIdsFromMdx))].sort();

  if (!env.figmaFileKey || !env.figmaPersonalAccessToken) {
    await writeFigmaImageManifest(createFigmaImageManifest([]));
    console.log(
      `[figma-images] Prepared an empty manifest for ${nodeIds.length} image(s); placeholders will be used`,
    );
    return;
  }

  const client = createFigmaClient(env.figmaPersonalAccessToken);
  const imageUrls = new Map<string, string>();

  for (let index = 0; index < nodeIds.length; index += MAX_IDS_PER_REQUEST) {
    const chunk = nodeIds.slice(index, index + MAX_IDS_PER_REQUEST);
    const resolved = await fetchFigmaImageUrls({
      client,
      fileKey: env.figmaFileKey,
      nodeIds: chunk,
      options: FIGMA_IMAGE_OPTIONS,
    });

    for (const [nodeId, url] of resolved) imageUrls.set(nodeId, url);
  }

  const missingIds = nodeIds.filter((nodeId) => !imageUrls.has(nodeId));
  if (missingIds.length > 0) {
    throw new Error(`[figma-images] Failed to resolve ${missingIds.length} image(s)`);
  }

  await writeFigmaImageManifest(
    createFigmaImageManifest(
      [...imageUrls].map(([nodeId, url]) => [
        getFigmaImageCacheKey(nodeId, FIGMA_IMAGE_OPTIONS),
        url,
      ]),
    ),
  );

  console.log(
    `[figma-images] Prepared ${imageUrls.size} image(s) from ${mdxPaths.length} MDX file(s) in ${Math.round(performance.now() - startedAt)}ms`,
  );
}

await main();
