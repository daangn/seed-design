import { Api as Figma } from "figma-api";
import { FlatCache } from "flat-cache";
import path from "node:path";
import { env } from "@/app/env";
import { getFigmaImageCacheKey, type FetchFigmaImageUrlsOptions } from "./figma-image-manifest";

export type { FetchFigmaImageUrlsOptions } from "./figma-image-manifest";

const LOG_PREFIX = "\n[remark-figma-image]";
const DEFAULT_MAX_RETRIES = 100;
const MAX_CONCURRENCY = 1;
const CACHE_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const CACHE_ID = "urls";

// Figma answers 429 with `Retry-After` in seconds, so that header decides how long to wait. The
// fallback covers the retryable errors that carry no header.
const FALLBACK_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 60_000;
const MAX_TOTAL_RETRY_MS = 8 * 60 * 1000;

// Turbopack transforms MDX in parallel workers that all draw from one rate limit bucket, so honoring
// an identical Retry-After would wake them on the same tick and re-saturate it. Spread the retries.
const RETRY_JITTER_MS = 1000;

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

// 캐시 우회 대상도 한 프로세스에서는 한 번만 새로 받는다. 빌드 전 manifest 생성기는
// 모든 ID를 한 프로세스에서 처리하므로 동일한 MDX가 다시 컴파일돼도 API를 재호출하지 않는다.
const refreshedCacheKeys = new Set<string>();

// Figma API

export function createFigmaClient(accessToken: string): Figma {
  if (!accessToken) throw new Error("FIGMA_PERSONAL_ACCESS_TOKEN is required");

  return new Figma({ personalAccessToken: accessToken });
}

export async function fetchFigmaImageUrls({
  client,
  fileKey,
  nodeIds,
  options = {},
  maxRetries = DEFAULT_MAX_RETRIES,
}: {
  client: Figma;
  fileKey: string;
  nodeIds: string[];
  options?: FetchFigmaImageUrlsOptions;
  maxRetries?: number;
}): Promise<Map<string, string>> {
  if (nodeIds.length === 0) return new Map();

  const result = new Map<string, string>();
  const uncachedIds: string[] = [];

  // nextjs calls fetchFigmaImageUrls multiple times in parallel even with a single FigmaImage
  // so we load the cache here to ensure we always have the latest data
  imageUrlCache.load(CACHE_ID, cacheDir);

  for (const nodeId of nodeIds) {
    const cached = shouldBypassCache(nodeId, options)
      ? undefined
      : imageUrlCache.get<string>(getFigmaImageCacheKey(nodeId, options));

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

  await acquireSemaphore();

  try {
    // Recheck cache after acquiring semaphore — earlier calls may have populated it while we waited
    imageUrlCache.load(CACHE_ID, cacheDir);
    const pendingIds = uncachedIds.filter((nodeId) => {
      const cached = shouldBypassCache(nodeId, options)
        ? undefined
        : imageUrlCache.get<string>(getFigmaImageCacheKey(nodeId, options));

      if (cached) {
        result.set(nodeId, cached);
        return false;
      }

      return true;
    });

    if (pendingIds.length === 0) return result;

    console.log(
      `${LOG_PREFIX} Fetching ${pendingIds.length} image(s) from Figma API... (options: ${JSON.stringify(options)})`,
    );

    const retryDeadline = Date.now() + MAX_TOTAL_RETRY_MS;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
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
          const cacheKey = getFigmaImageCacheKey(nodeId, options);
          imageUrlCache.set(cacheKey, url);
          if (isCacheBypassRequested(nodeId)) refreshedCacheKeys.add(cacheKey);
        }

        imageUrlCache.save();

        return result;
      } catch (error) {
        const waitTime = getRetryDelayMs(error);

        if (
          waitTime === null ||
          attempt === maxRetries - 1 ||
          Date.now() + waitTime > retryDeadline
        )
          throw error;

        console.log(
          `${LOG_PREFIX} ${error instanceof Error ? error.message : String(error)}, waiting ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})...`,
        );

        await delay(waitTime);
      }
    }

    throw new Error("Failed to fetch Figma images after retries");
  } finally {
    releaseSemaphore();
  }
}

// Helpers

/**
 * figma-api hangs the underlying axios error off `ApiError.error` and exports neither type, so the
 * single field read here is declared locally.
 */
interface FigmaApiError {
  error?: { response?: { headers?: Record<string, string | undefined> } };
}

function isCacheBypassRequested(nodeId: string): boolean {
  return env.figmaCacheDisabled || env.figmaBypassCacheNodeIds.includes(nodeId);
}

function shouldBypassCache(nodeId: string, options: FetchFigmaImageUrlsOptions): boolean {
  return (
    isCacheBypassRequested(nodeId) &&
    !refreshedCacheKeys.has(getFigmaImageCacheKey(nodeId, options))
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * How long to wait before retrying, or `null` when the request should not be retried at all.
 */
export function getRetryDelayMs(error: unknown): number | null {
  if (!isRetryableError(error)) return null;

  const retryAfterMs = getRetryAfterMs(error) ?? FALLBACK_RETRY_DELAY_MS;

  // Figma has been observed handing out multi-day Retry-After values when it misclassifies a token's
  // seat type. Waiting one out would outlast the build itself, so surface the 429 instead.
  if (retryAfterMs > MAX_RETRY_DELAY_MS) return null;

  return retryAfterMs + Math.floor(Math.random() * RETRY_JITTER_MS);
}

function getRetryAfterMs(error: unknown): number | null {
  const seconds = Number((error as FigmaApiError).error?.response?.headers?.["retry-after"]);

  if (!Number.isFinite(seconds) || seconds < 0) return null;

  return seconds * 1000;
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
