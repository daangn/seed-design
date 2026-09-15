import { type RawData, addressesOf, createDocsSearch } from "@seed-design/docs-search";
import { DEFAULT_TIMEOUT, SEARCH_INDEX_ENDPOINT, SEED_DOCS_BASE_URL } from "./constants.js";

/**
 * Full-text search over the site's own index, shared with the documentation site and the CLI
 * through `@seed-design/docs-search` so one query ranks the same way in all three.
 *
 * The index is around 1.5MB compressed and costs roughly 100ms to parse and load, so it is
 * held for the life of the process rather than passed through the LRU the other endpoints use
 * — that cache measures entries by serialising them, which would restringify this one on every
 * read. It is revalidated by ETag once it is old enough that a docs deploy could have landed.
 */

const REVALIDATE_AFTER_MS = 30 * 60 * 1000;

/** Wide enough that the pages, not the chunks, are what the cutoff below actually cuts. */
const RETRIEVAL = { limit: 200, maxResultsPerPage: 1 };

/** How many addresses a caller can act on before the list stops being an answer. */
const SHOWN = 20;

interface LoadedIndex {
  at: number;
  etag?: string;
  docs: ReturnType<typeof createDocsSearch>;
}

let loaded: LoadedIndex | undefined;
let loading: Promise<LoadedIndex> | undefined;

async function fetchIndex(previous?: LoadedIndex): Promise<LoadedIndex> {
  const url = `${SEED_DOCS_BASE_URL}${SEARCH_INDEX_ENDPOINT}`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    ...(previous?.etag && { headers: { "if-none-match": previous.etag } }),
  }).catch((error) => {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error(`Timed out after ${DEFAULT_TIMEOUT}ms fetching ${url}`);
    }
    throw error;
  });

  // 304 carries no body, and this server does not repeat the ETag on one either, so the entry
  // keeps the tag it was fetched with.
  if (response.status === 304 && previous) return { ...previous, at: Date.now() };

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return {
    at: Date.now(),
    ...(response.headers.get("etag") && { etag: response.headers.get("etag") ?? undefined }),
    docs: createDocsSearch((await response.json()) as RawData),
  };
}

/** One load at a time, however many searches arrive while it is in flight. */
function index(): Promise<LoadedIndex> {
  if (loaded && Date.now() - loaded.at < REVALIDATE_AFTER_MS) return Promise.resolve(loaded);
  if (loading) return loading;

  loading = fetchIndex(loaded)
    .then((next) => {
      loaded = next;
      return next;
    })
    .catch((error) => {
      // A refresh that fails leaves the copy already in hand answering, since a slightly old
      // index answers the same question as a current one.
      if (loaded) return loaded;
      throw error;
    })
    .finally(() => {
      loading = undefined;
    });

  return loading;
}

export async function searchDocs(query: string) {
  const addresses = addressesOf(await (await index()).docs.search(query, RETRIEVAL));

  return { addresses: addresses.slice(0, SHOWN), total: addresses.length };
}
