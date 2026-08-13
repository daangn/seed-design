import type * as FigmaRestAPI from "@figma/rest-api-spec";
import { readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type FetchFigmaImageUrlsOptions = Omit<FigmaRestAPI.GetImagesQueryParams, "ids" | "version">;

export interface FigmaImageManifest {
  version: 1;
  images: Record<string, string>;
}

export const FIGMA_IMAGE_MANIFEST_PATH = path.resolve(
  process.cwd(),
  ".cache/figma-image/build-manifest.json",
);

export function createFigmaImageManifest(
  entries: Iterable<readonly [string, string]>,
): FigmaImageManifest {
  return {
    version: 1,
    images: Object.fromEntries([...entries].sort(([a], [b]) => a.localeCompare(b))),
  };
}

export function readFigmaImageManifest(
  manifestPath = FIGMA_IMAGE_MANIFEST_PATH,
): FigmaImageManifest {
  try {
    const parsed = JSON.parse(readFileSync(manifestPath, "utf-8")) as FigmaImageManifest;

    if (parsed.version !== 1 || !parsed.images || typeof parsed.images !== "object") {
      throw new Error(`Unsupported Figma image manifest: ${manifestPath}`);
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return createFigmaImageManifest([]);
    }
    throw error;
  }
}

export async function writeFigmaImageManifest(
  manifest: FigmaImageManifest,
  manifestPath = FIGMA_IMAGE_MANIFEST_PATH,
): Promise<boolean> {
  const content = `${JSON.stringify(manifest, null, 2)}\n`;

  try {
    if ((await readFile(manifestPath, "utf-8")) === content) return false;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, content, "utf-8");
  return true;
}

export function getFigmaImageCacheKey(nodeId: string, options: FetchFigmaImageUrlsOptions): string {
  const optionsKey = JSON.stringify(options, Object.keys(options).sort());
  return `${nodeId}:${optionsKey}`;
}

export function getFigmaImageUrlsFromManifest(
  manifest: FigmaImageManifest,
  nodeIds: Iterable<string>,
  options: FetchFigmaImageUrlsOptions,
): Map<string, string> {
  const result = new Map<string, string>();

  for (const nodeId of nodeIds) {
    const url = manifest.images[getFigmaImageCacheKey(nodeId, options)];
    if (url) result.set(nodeId, url);
  }

  return result;
}
