const BATCH_SIZES = [50, 10, 1] as const;
const DEFAULT_RETRY_DELAY_MS = 1000;

interface RetryContext {
  batchSize: number;
  missingIds: readonly string[];
}

interface ResolveFigmaImageUrlsOptions {
  nodeIds: readonly string[];
  fetchUrls: (nodeIds: string[]) => Promise<ReadonlyMap<string, string>>;
  retryDelayMs?: number;
  onRetry?: (context: RetryContext) => void;
}

export async function resolveFigmaImageUrls({
  nodeIds,
  fetchUrls,
  retryDelayMs = DEFAULT_RETRY_DELAY_MS,
  onRetry,
}: ResolveFigmaImageUrlsOptions): Promise<Map<string, string>> {
  const imageUrls = new Map<string, string>();
  let missingIds = [...new Set(nodeIds)];

  for (const [stageIndex, batchSize] of BATCH_SIZES.entries()) {
    if (missingIds.length === 0) break;

    if (stageIndex > 0) {
      onRetry?.({ batchSize, missingIds });
      await delay(retryDelayMs);
    }

    const requestedIds = missingIds;

    for (let index = 0; index < requestedIds.length; index += batchSize) {
      const batch = requestedIds.slice(index, index + batchSize);
      const resolved = await fetchUrls(batch);

      for (const [nodeId, url] of resolved) {
        if (batch.includes(nodeId)) imageUrls.set(nodeId, url);
      }
    }

    missingIds = requestedIds.filter((nodeId) => !imageUrls.has(nodeId));
  }

  return imageUrls;
}

function delay(ms: number): Promise<void> {
  return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
}
