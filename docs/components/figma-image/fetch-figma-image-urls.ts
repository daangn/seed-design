import { Api as Figma } from "figma-api";
import * as FigmaRestAPI from "@figma/rest-api-spec";

// Retry logic for rate limits (429)
const maxRetries = 3;

// In-memory cache to avoid hitting rate limits during dev server hot reloads
// Persists for the duration of the dev server session
const imageUrlCache = new Map<string, string>();

function getCacheKey(fileKey: string, nodeId: string): string {
  return `${fileKey}:${nodeId}`;
}

export type FetchFigmaImageUrlsOptions = Omit<FigmaRestAPI.GetImagesQueryParams, "ids" | "version">;

export async function fetchFigmaImageUrls(
  client: Figma,
  fileKey: string,
  nodeIds: string[],
  options: FetchFigmaImageUrlsOptions = {},
): Promise<Map<string, string>> {
  if (nodeIds.length === 0) return new Map();

  const result = new Map<string, string>();
  const uncachedIds: string[] = [];

  for (const nodeId of nodeIds) {
    const cached = imageUrlCache.get(getCacheKey(fileKey, nodeId));

    if (cached) {
      result.set(nodeId, cached);
    } else {
      uncachedIds.push(nodeId);
    }
  }

  if (uncachedIds.length === 0) {
    console.log(`[remark-figma-image] Cache hit for ${nodeIds.length} image(s)`);
    return result;
  }

  console.log(
    result.size > 0
      ? `[remark-figma-image] Cache hit: ${result.size}, fetching: ${uncachedIds.length}`
      : `[remark-figma-image] Fetching ${uncachedIds.length} image(s) from Figma API...`,
  );

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await client.getImages(
        { file_key: fileKey },
        { ids: uncachedIds.join(","), ...options },
      );

      if (response.err) throw new Error(`Figma API error: ${response.err}`);

      const images = response.images ?? {};

      for (const [nodeId, url] of Object.entries(images)) {
        if (url) {
          result.set(nodeId, url);

          imageUrlCache.set(getCacheKey(fileKey, nodeId), url);
        }
      }

      return result;
    } catch (error) {
      // TODO: check if this is how figma gives rate limit errors
      if (error instanceof Error && error.message.includes("429")) {
        lastError = error;

        const waitTime = 2 ** attempt * 3000; // 3s, 6s, 12s

        console.log(`[remark-figma-image] Rate limited, waiting ${waitTime}ms before retry...`);

        await delay(waitTime);

        continue;
      }

      // Non-rate-limit errors: throw immediately
      throw error;
    }
  }

  throw lastError ?? new Error("Failed to fetch Figma images after retries");
}

export function createFigmaClient(accessToken: string): Figma {
  if (!accessToken) throw new Error("FIGMA_PERSONAL_ACCESS_TOKEN is required");

  return new Figma({ personalAccessToken: accessToken });
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
