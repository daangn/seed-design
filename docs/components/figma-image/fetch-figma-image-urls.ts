import { Api as Figma } from "figma-api";
import * as FigmaRestAPI from "@figma/rest-api-spec";
import { FlatCache } from "flat-cache";
import path from "node:path";
import { env } from "@/app/env";

const LOG_PREFIX = "\n[remark-figma-image]";
const MAX_RETRIES = 7;
const MAX_CONCURRENCY = 1;
const CACHE_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const CACHE_ID = "urls";

// Simple semaphore to limit concurrent Figma API requests
let activeRequests = 0;
const waitQueue: (() => void)[] = [];

function acquireSemaphore(): Promise<void> {
  if (activeRequests < MAX_CONCURRENCY) {
    activeRequests++;
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    waitQueue.push(() => {
      activeRequests++;
      resolve();
    });
  });
}

function releaseSemaphore(): void {
  activeRequests--;
  const next = waitQueue.shift();
  if (next) next();
}

// Store cache in docs/.cache/figma-image (gitignored. persisted via Actions cache)
const cacheDir = path.resolve(process.cwd(), ".cache/figma-image");

const imageUrlCache = new FlatCache({
  cacheDir,
  cacheId: CACHE_ID,
  ttl: CACHE_TTL_MS,
});

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
    const cached = env.figmaCacheDisabled
      ? undefined
      : imageUrlCache.get<string>(getCacheKey(nodeId, options));

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

  await acquireSemaphore();

  let lastError: Error | null = null;

  try {
    // Recheck cache after acquiring semaphore — earlier calls may have populated it while we waited
    imageUrlCache.load(CACHE_ID, cacheDir);
    const pendingIds = uncachedIds.filter((nodeId) => {
      const cached = env.figmaCacheDisabled
        ? undefined
        : imageUrlCache.get<string>(getCacheKey(nodeId, options));

      if (cached) {
        result.set(nodeId, cached);
        return false;
      }

      return true;
    });

    if (pendingIds.length === 0) return result;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await client.getImages(
          { file_key: fileKey },
          { ids: pendingIds.join(","), ...options },
        );

        if (response.err) throw new Error(`Figma API error: ${response.err}`);

        const images = response.images ?? {};

        for (const [nodeId, url] of Object.entries(images)) {
          if (!url) continue;

          result.set(nodeId, url);
          imageUrlCache.set(getCacheKey(nodeId, options), url);
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
  } finally {
    releaseSemaphore();
  }
}

// Helpers

function getCacheKey(nodeId: string, options: FetchFigmaImageUrlsOptions): string {
  const optionsKey = JSON.stringify(options, Object.keys(options).sort());
  return `${nodeId}:${optionsKey}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message;

  // Rate limit
  if (message.includes("429")) return true;

  // Network errors caused by rate limiting or transient issues
  if (message.includes("socket hang up")) return true;
  if (message.includes("ECONNRESET")) return true;
  if (message.includes("ETIMEDOUT")) return true;
  if (message.includes("EPIPE")) return true;

  return false;
}
