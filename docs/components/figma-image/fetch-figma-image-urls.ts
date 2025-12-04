import { Api as Figma } from "figma-api";
import * as FigmaRestAPI from "@figma/rest-api-spec";
import { FlatCache } from "flat-cache";
import findCacheDirectory from "find-cache-directory";

const LOG_PREFIX = "\n[remark-figma-image]";
const MAX_RETRIES = 3;
const CACHE_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const CACHE_ID = "urls";

const isCacheDisabled = process.env.FIGMA_CACHE_DISABLED === "1";

// will be node_modules/.cache/remark-figma-image
const cacheDir = findCacheDirectory({ name: "remark-figma-image" });

if (!cacheDir) throw new Error("Could not determine cache directory");

const imageUrlCache = new FlatCache({
  cacheDir,
  cacheId: CACHE_ID,
  ttl: CACHE_TTL_MS,
});

// imageUrlCache.load(CACHE_ID, cacheDir);

// Figma API

export type FetchFigmaImageUrlsOptions = Omit<FigmaRestAPI.GetImagesQueryParams, "ids" | "version">;

export function createFigmaClient(accessToken: string): Figma {
  if (!accessToken) throw new Error("FIGMA_PERSONAL_ACCESS_TOKEN is required");
  return new Figma({ personalAccessToken: accessToken });
}

export async function fetchFigmaImageUrls({
  client,
  fileKey,
  nodeIds,
  options = {},
}: {
  client: Figma;
  fileKey: string;
  nodeIds: string[];
  options?: FetchFigmaImageUrlsOptions;
}): Promise<Map<string, string>> {
  if (nodeIds.length === 0) return new Map();

  const result = new Map<string, string>();
  const uncachedIds: string[] = [];

  // nextjs calls fetchFigmaImageUrls multiple times in parallel even with a single FigmaImage
  // so we load the cache here to ensure we always have the latest data
  imageUrlCache.load(CACHE_ID, cacheDir);

  for (const nodeId of nodeIds) {
    const cached = isCacheDisabled
      ? undefined
      : imageUrlCache.get<string>(getCacheKey(fileKey, nodeId));

    if (cached) {
      result.set(nodeId, cached);
    } else {
      uncachedIds.push(nodeId);
    }
  }

  if (result.size > 0) {
    console.log(`${LOG_PREFIX} Cache hit for ${result.size} image(s)`);
  }

  if (uncachedIds.length === 0) {
    return result;
  }

  console.log(
    `${LOG_PREFIX} Fetching ${uncachedIds.length} image(s) from Figma API... (options: ${JSON.stringify(options)})`,
  );

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await client.getImages(
        { file_key: fileKey },
        { ids: uncachedIds.join(","), ...options },
      );

      if (response.err) throw new Error(`Figma API error: ${response.err}`);

      const images = response.images ?? {};

      for (const [nodeId, url] of Object.entries(images)) {
        if (!url) continue;

        result.set(nodeId, url);
        imageUrlCache.set(getCacheKey(fileKey, nodeId), url);
      }

      imageUrlCache.save();

      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (!isRetryableError(error)) throw error;

      const waitTime = 2 ** attempt * 3000; // 3s, 6s, 12s

      console.log(
        `${LOG_PREFIX} ${lastError.message}, waiting ${waitTime}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`,
      );

      await delay(waitTime);
    }
  }

  throw lastError ?? new Error("Failed to fetch Figma images after retries");
}

// Helpers

function getCacheKey(fileKey: string, nodeId: string): string {
  return `${fileKey}:${nodeId}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  // TODO: Improve error detection
  return false;
}
