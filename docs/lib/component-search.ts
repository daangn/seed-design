import type { PlatformKey } from "./platform-status";
import { normalizeSearchText } from "./search-text";

/** Static JSON index built by `app/api/component-search/route.ts`. */
export const COMPONENT_SEARCH_API = "/api/component-search";

/**
 * One component document, flattened at build time so the search dialog gets the platform
 * rollout — which lives in Sanity and is only reachable from a server component — without
 * a query of its own.
 */
export interface ComponentSearchEntry {
  /** Page slug, e.g. `action-button`. */
  slug: string;
  title: string;
  description?: string;
  /** Design guideline page, e.g. `/components/action-button`. */
  url: string;
  /** Cover image in its on-page form, from `resolveCoverImage()`. */
  thumbnail?: string;
  /** Platforms the component ships on, in `PLATFORM_CONFIG` order. */
  platforms: { key: PlatformKey; url?: string }[];
}

/**
 * Higher is better; 0 drops the component. The tiers go from "the user typed this
 * component's name" down to "only the Korean description mentions it", so `button` puts the
 * five components named after one above everything whose description happens to say 버튼.
 */
function scoreEntry(entry: ComponentSearchEntry, query: string, terms: string[]) {
  const name = normalizeSearchText(entry.title);
  if (name === query || normalizeSearchText(entry.slug) === query) return 1000;

  // Padding both sides turns "lands on a word boundary" into a plain substring test. Within
  // a tier an earlier hit wins, because a query naming the first word names what the
  // component is (`button` → Button) rather than what it is a variation of (Input Button).
  const padded = ` ${name} `;

  const wholeWords = padded.indexOf(` ${query} `);
  if (wholeWords >= 0) return 900 - Math.min(wholeWords, 50);

  const wordStart = padded.indexOf(` ${query}`);
  if (wordStart >= 0) return 700 - Math.min(wordStart, 50);

  if (name.includes(query)) return 400;

  // `actionbutton` — the name typed as one word, which no separator-splitting tier catches.
  if (name.replace(/ /g, "").includes(query.replace(/ /g, ""))) return 300;

  if (terms.every((term) => name.includes(term))) return 200;

  const description = entry.description?.toLowerCase();
  if (description && terms.every((term) => description.includes(term))) return 100;

  return 0;
}

export function matchComponents(entries: ComponentSearchEntry[], search: string) {
  const query = normalizeSearchText(search);
  if (!query) return [];

  const terms = query.split(" ");

  return (
    entries
      .map((entry) => ({ entry, score: scoreEntry(entry, query, terms) }))
      .filter(({ score }) => score > 0)
      // Within a tier the shorter name is the more general component (Button before Input
      // Button), which is the one people usually mean.
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.entry.title.length - b.entry.title.length ||
          a.entry.title.localeCompare(b.entry.title),
      )
      .map(({ entry }) => entry)
  );
}
