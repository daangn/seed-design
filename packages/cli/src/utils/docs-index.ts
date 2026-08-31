import type { DocsCategory, DocsItem } from "@/src/schema";

/**
 * Reading the published docs index: the address it gives a document, and the two lookups
 * built on that address.
 *
 * `docs` and `search` share this file on purpose. `docs` resolves an address and nothing
 * else, `search` matches names and nothing else, and both have to name a document with the
 * same string or a path one of them prints cannot be handed to the other.
 */

export interface DocsEntry {
  category: DocsCategory;
  item: DocsItem;
  path: string;
}

/**
 * The address of a document: what `docs` accepts, and what every listing prints.
 *
 * Taken from `docUrl` rather than rebuilt as `category/section/item`. A section groups by
 * the page's first slug, so rebuilding drops the middle slugs of anything nested deeper and
 * lands `components/concepts/composition` and `components/iconography/composition` on one
 * path. A category's own landing page has no slug at all, and the category path already
 * names the category listing, so that one keeps its id as the last segment.
 */
export function pathOf(category: DocsCategory, item: DocsItem): string {
  if (item.docUrl === `/${category.id}`) return `${category.id}/${item.id}`;

  return item.docUrl.replace(/^\//, "");
}

function entriesOf(categories: DocsCategory[]): DocsEntry[] {
  return categories.flatMap((category) =>
    category.sections.flatMap((section) =>
      section.items.map((item) => ({ category, item, path: pathOf(category, item) })),
    ),
  );
}

/**
 * Split a query into path segments.
 * e.g. "react/components/action-button" → ["react", "components", "action-button"]
 */
export function parseQueryPath(query: string): string[] {
  return query
    .split(/[/\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** The document whose address is exactly `path`, and no other. */
export function findByPath(categories: DocsCategory[], path: string): DocsItem | undefined {
  return entriesOf(categories).find((entry) => entry.path === path)?.item;
}

/** Addresses of the documents whose id is exactly `id`, for a failed lookup to point at. */
export function pathsNamed(categories: DocsCategory[], id: string): string[] {
  return entriesOf(categories)
    .filter((entry) => entry.item.id === id)
    .map((entry) => entry.path);
}

/** Documents whose id or title contains `query`. The whole of what `search` does. */
export function matchItems(categories: DocsCategory[], query: string): DocsEntry[] {
  const q = query.toLowerCase();
  return entriesOf(categories).filter(
    (entry) =>
      entry.item.id.toLowerCase().includes(q) || entry.item.title.toLowerCase().includes(q),
  );
}

/**
 * Compute the Levenshtein (edit) distance between two strings.
 * Used to suggest similar valid paths when users make typos.
 */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0),
      );
    }
  }
  return dp[m][n];
}

/**
 * Addresses within `maxDistance` edits of `query`, nearest first.
 *
 * Only ever reached once a lookup has already failed, so nothing it returns can stand in
 * for an answer. Container paths are in the pool because a typo lands on one as readily as
 * on a document.
 */
export function similarPaths(
  categories: DocsCategory[],
  query: string,
  limit = 3,
  maxDistance = 5,
): string[] {
  const containers = categories.flatMap((category) => [
    category.id,
    ...category.sections.map((section) => `${category.id}/${section.id}`),
  ]);
  const candidates = [...containers, ...entriesOf(categories).map((entry) => entry.path)];

  return (
    candidates
      .map((path) => ({ path, dist: levenshtein(query.toLowerCase(), path.toLowerCase()) }))
      // A distance as large as the query itself means nothing was recognised, only that both
      // strings are short. Without this, a query sharing no characters at all with the index
      // still comes back with `docs`, `lynx` and `react` as its three best guesses.
      .filter(({ dist }) => dist > 0 && dist <= maxDistance && dist < query.length)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, limit)
      .map(({ path }) => path)
  );
}

export function alignedLines(entries: { path: string; note?: string }[]): string[] {
  const width = Math.max(...entries.map((entry) => entry.path.length));
  return entries.map(({ path, note }) => (note ? `${path.padEnd(width)}  ${note}` : path));
}
