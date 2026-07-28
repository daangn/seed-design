const FETCH_TIMEOUT_MS = 10_000;
const CONCURRENCY = 16;

export type FetchImpl = typeof fetch;

/** 타임아웃이 걸린 JSON fetch. 실패 메시지에 URL을 포함해 진단을 돕는다. */
export async function fetchJson(
  url: string,
  fetchImpl: FetchImpl,
  timeoutMs = FETCH_TIMEOUT_MS,
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`요청이 실패했어요 (${response.status} ${response.statusText}): ${url}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`요청 시간이 초과되었어요 (${timeoutMs}ms): ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/** 청크 단위 병렬 실행 — rootage 컴포넌트 ~90개 fetch에 과도한 동시성을 걸지 않는다. */
export async function mapWithConcurrency<T, R>(
  items: T[],
  mapper: (item: T) => Promise<R>,
  concurrency = CONCURRENCY,
): Promise<R[]> {
  const results: R[] = [];
  for (let index = 0; index < items.length; index += concurrency) {
    const chunk = items.slice(index, index + concurrency);
    results.push(...(await Promise.all(chunk.map(mapper))));
  }
  return results;
}
