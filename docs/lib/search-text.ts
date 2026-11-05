/**
 * `$color.bg.neutral-solid` → `color bg neutral solid`, `Action Button` → `action button`.
 * Token ids and component slugs mix `.`, `-` and `/` as separators, so flattening them all to
 * spaces lets one query shape match however the user happened to type it (`bg.neutral`,
 * `bg neutral`, `bg-neutral`).
 */
export const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[$.\-_/\s]+/g, " ")
    .trim();

export const splitQueryTerms = (search: string) =>
  normalizeSearchText(search).split(" ").filter(Boolean);

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Cut `text` into alternating plain and matched chunks so the caller can mark the parts
 * the query hit — the same treatment fumadocs gives document results, except the terms
 * are matched here rather than arriving pre-wrapped in `<mark>`.
 *
 * Terms come from the normalized query, so they never span a separator; matching them
 * against the raw text highlights each segment the user typed and leaves the `.`/`-`
 * between them alone.
 */
export function splitHighlights(text: string, terms: string[]) {
  if (terms.length === 0) return [{ text, match: false }];

  return (
    text
      .split(new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi"))
      // `split` with one capture group interleaves plain text and matches, so the odd
      // slots are the hits.
      .map((chunk, index) => ({ text: chunk, match: index % 2 === 1 }))
      .filter((chunk) => chunk.text !== "")
  );
}
