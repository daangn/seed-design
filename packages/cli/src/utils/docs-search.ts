import { addressesOf, createDocsSearch } from "@seed-design/docs-search";
import { fetchCached } from "@/src/utils/index-cache";

/**
 * Full-text search over the index the documentation site publishes, shared with the site's own
 * search dialog through `@seed-design/docs-search` so the same query ranks the same way here.
 *
 * The index is the whole corpus rather than a list of names, so `search` answers questions the
 * old substring match could not — but only in the words the docs themselves use. The tokenizer
 * splits on whitespace and punctuation without analysing morphemes, so `액션 버튼` finds what
 * `액션버튼` does not.
 */

/** Wide enough that the pages, not the chunks, are what the limit below actually cuts. */
const RETRIEVAL = { limit: 200, maxResultsPerPage: 1 };

/** How many addresses a caller can read before the list stops being an answer. */
const SHOWN = 20;

export interface SearchOutcome {
  addresses: string[];
  total: number;
}

export async function searchDocs({
  baseUrl,
  query,
}: {
  baseUrl: string;
  query: string;
}): Promise<SearchOutcome> {
  const docs = createDocsSearch(JSON.parse(await fetchCached(`${baseUrl}/api/search.json`)));
  const addresses = addressesOf(await docs.search(query, RETRIEVAL));

  return { addresses: addresses.slice(0, SHOWN), total: addresses.length };
}
