import type { DocsCategory } from "@/src/schema";
import { containersOf, entriesOf } from "./docs-address";

/**
 * How a listing is laid out, and what a failed lookup offers instead. The address grammar the
 * three subcommands share lives in `docs-address.ts`; this file only reads the index through
 * it. Searching does not pass through here at all — `docs-search.ts` queries the site's
 * full-text index instead.
 */

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
export function similarAddresses(
  categories: DocsCategory[],
  query: string,
  limit = 3,
  maxDistance = 5,
): string[] {
  const candidates = [
    ...containersOf(categories),
    ...entriesOf(categories).map((entry) => entry.address),
  ];

  return (
    candidates
      .map((address) => ({
        address,
        dist: levenshtein(query.toLowerCase(), address.toLowerCase()),
      }))
      // A distance as large as the query itself means nothing was recognised, only that both
      // strings are short. Without this, a query sharing no characters at all with the index
      // still comes back with `docs`, `lynx` and `react` as its three best guesses.
      .filter(({ dist }) => dist > 0 && dist <= maxDistance && dist < query.length)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, limit)
      .map(({ address }) => address)
  );
}

export function alignedLines(entries: { address: string; note?: string }[]): string[] {
  const width = Math.max(...entries.map((entry) => entry.address.length));
  return entries.map(({ address, note }) => (note ? `${address.padEnd(width)}  ${note}` : address));
}
