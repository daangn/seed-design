import { normalizeSearchText } from "./search-text";

/** Static JSON index built by `app/api/token-search/route.ts`. */
export const TOKEN_SEARCH_API = "/api/token-search";

const TOKEN_REFERENCE_URL = "/foundations/design-token/reference";

export const tokenReferenceHref = (id: string) =>
  `${TOKEN_REFERENCE_URL}/${encodeURIComponent(id)}`;

/** How many tiles the token section shows before it offers to reveal the rest. */
export const TOKEN_RESULT_LIMIT = 8;

/** CSS for the preview box, per theme. Non-color collections repeat one value. */
export interface ThemedCss {
  light: string;
  dark: string;
}

/**
 * One design token, flattened at build time so the search dialog never pulls
 * `@seed-design/rootage-core` (and the alias resolution it does) into the page bundle.
 */
export interface TokenSearchEntry {
  /** Full id, e.g. `$color.bg.neutral-solid`. */
  id: string;
  /** Everything before the last segment, e.g. `$color.bg`. */
  group: string;
  /** Last segment, e.g. `neutral-solid`. */
  key: string;
  /** Resolved value's `AST.ValueLit` kind — picks the glyph when there's no preview. */
  kind: string;
  /** Resolved value as text, e.g. `#1a1c20`, `1rem (16px)`, `300ms`. */
  label: string;
  description?: string;
  /** `background` for color and gradient tokens. */
  background?: ThemedCss;
  /** `box-shadow` for shadow tokens. */
  boxShadow?: ThemedCss;
}

/**
 * Higher is better; 0 drops the token. The tiers go from "the user typed this exact
 * token" down to "only the Korean description mentions it", so a paste of a full id
 * always wins over the hundred tokens that merely share its prefix.
 */
function scoreEntry(entry: TokenSearchEntry, query: string, terms: string[]) {
  const id = normalizeSearchText(entry.id);
  if (id === query) return 1000;

  // Normalization leaves the segments space-separated, so padding both sides turns
  // "lands on a segment boundary" into a plain substring test. Within a tier an earlier
  // hit wins, because a query that names a segment near the front names a whole family
  // (`bg` → `$color.bg.*`) rather than one token's leaf (`$color.manner-temp.l1.bg`).
  const padded = ` ${id} `;

  const wholeSegments = padded.indexOf(` ${query} `);
  if (wholeSegments >= 0) return 900 - Math.min(wholeSegments, 50);

  const segmentStart = padded.indexOf(` ${query}`);
  if (segmentStart >= 0) return 700 - Math.min(segmentStart, 50);

  if (id.includes(query)) return 400;
  if (terms.every((term) => id.includes(term))) return 200;

  const description = entry.description?.toLowerCase();
  if (description && terms.every((term) => description.includes(term))) return 100;

  return 0;
}

export function matchTokens(entries: TokenSearchEntry[], search: string) {
  const query = normalizeSearchText(search);
  if (!query) return [];

  const terms = query.split(" ");

  const ranked = entries
    .map((entry) => ({ entry, score: scoreEntry(entry, query, terms) }))
    .filter(({ score }) => score > 0)
    // Within a tier the shorter id is the more general token (`$color.bg.neutral` before
    // `$color.bg.neutral-solid`), which is the one people usually mean.
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.entry.id.length - b.entry.id.length ||
        a.entry.id.localeCompare(b.entry.id),
    )
    .map(({ entry }) => entry);

  // Tokens in a group share a preview shape, so a relevance-interleaved list makes the
  // grid flicker between swatches, chips and rules. Cluster them, ordering the groups by
  // where their best match landed — the top result is still whatever ranked first, it
  // just brings its siblings along.
  const groups = new Map<string, TokenSearchEntry[]>();
  for (const entry of ranked) {
    const group = groups.get(entry.group);
    if (group) group.push(entry);
    else groups.set(entry.group, [entry]);
  }

  return [...groups.values()].flat();
}
