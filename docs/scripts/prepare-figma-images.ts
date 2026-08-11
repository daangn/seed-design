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
import { resolveFigmaImageUrls } from "@/components/figma-image/resolve-figma-image-urls";

const FIGMA_IMAGE_OPTIONS = { format: "png", scale: 2 } as const;

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
  const sources = await Promise.all(
    mdxPaths.map(async (filePath) => ({ filePath, source: await readFile(filePath, "utf-8") })),
  );
  const sourcePathsByNodeId = new Map<string, string[]>();

  for (const { filePath, source } of sources) {
    for (const nodeId of collectFigmaImageIdsFromMdx(source)) {
      const sourcePaths = sourcePathsByNodeId.get(nodeId) ?? [];
      sourcePaths.push(path.relative(contentDir, filePath));
      sourcePathsByNodeId.set(nodeId, sourcePaths);
    }
  }

  const nodeIds = [...sourcePathsByNodeId.keys()].sort();
  const fileKey = env.figmaFileKey;
  const accessToken = env.figmaPersonalAccessToken;

  if (!fileKey || !accessToken) {
    await writeFigmaImageManifest(createFigmaImageManifest([]));
    console.log(
      `[figma-images] Prepared an empty manifest for ${nodeIds.length} image(s); placeholders will be used`,
    );
    return;
  }

  const client = createFigmaClient(accessToken);
  const imageUrls = await resolveFigmaImageUrls({
    nodeIds,
    fetchUrls: (batch) =>
      fetchFigmaImageUrls({
        client,
        fileKey,
        nodeIds: batch,
        options: FIGMA_IMAGE_OPTIONS,
      }),
    onRetry: ({ batchSize, missingIds }) => {
      console.warn(
        `[figma-images] Retrying ${missingIds.length} unresolved image(s) in batches of ${batchSize}`,
      );
    },
  });

  const missingIds = nodeIds.filter((nodeId) => !imageUrls.has(nodeId));
  if (missingIds.length > 0) {
    const details = missingIds
      .map((nodeId) => `- ${nodeId}: ${sourcePathsByNodeId.get(nodeId)?.join(", ") ?? "unknown"}`)
      .join("\n");

    throw new Error(
      `[figma-images] Failed to resolve ${missingIds.length} image(s) after individual retries:\n${details}`,
    );
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
