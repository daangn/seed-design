import type { PlatformKey } from "./platform-status";
import { normalizeSearchText } from "./search-text";

/** Static JSON index built by `app/api/component-search/route.ts`. */
export const COMPONENT_SEARCH_API = "/api/component-search";

/**
 * How many cards the component section shows before it offers to reveal the rest — one row
 * on the dialog's desktop width. A query naming a family (`button`) matches five or six
 * components, and laying them all out would push the token and document blocks under it off
 * the first screenful.
 */
export const COMPONENT_RESULT_LIMIT = 3;

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
  /**
   * Search terms the document declares in its frontmatter for queries its own words never
   * answer. Component names are written in English throughout, so `메뉴` reaches nothing on
   * the Menu page — an alias is the only thing that carries the word people search in.
   */
  keywords?: string[];
  /** Design guideline page, e.g. `/components/action-button`. */
  url: string;
  /** Cover image in its on-page form, from `resolveCoverImage()`. */
  thumbnail?: string;
  /**
   * Shipped platforms per component the page documents, in `componentIds` order — a page can
   * cover more than one (`manner-temp` → Manner Temp + Manner Temp Badge), and each keeps its
   * own rollout and its own links, the way the page's status table shows them. Components
   * with nothing shipped are left out.
   */
  components: { name: string; platforms: { key: PlatformKey; url?: string }[] }[];
}

/**
 * Higher is better; 0 drops the component. The tiers go from "the user typed this
 * component's name" down to "only the Korean description mentions it", so `button` puts the
 * five components named after one above everything whose description happens to say 버튼.
 */
function scoreEntry(entry: ComponentSearchEntry, query: string, terms: string[]) {
  const name = normalizeSearchText(entry.title);
  const keywords = entry.keywords?.map(normalizeSearchText) ?? [];
  if (name === query || normalizeSearchText(entry.slug) === query) return 1000;

  // Padding both sides turns "lands on a word boundary" into a plain substring test. Within
  // a tier an earlier hit wins, because a query naming the first word names what the
  // component is (`button` → Button) rather than what it is a variation of (Input Button).
  const padded = ` ${name} `;

  const wholeWords = padded.indexOf(` ${query} `);
  if (wholeWords >= 0) return 900 - Math.min(wholeWords, 50);

  // A keyword is written down by hand rather than read off the page, so a query that is one
  // names the component as squarely as its own name does — under a name that spells the
  // query out, over one that merely opens with it. Spaces come off both sides the way the
  // one-word name tier below takes them off: `메뉴 시트` and `메뉴시트` are the same word,
  // and which one gets typed is nobody's convention to fix.
  const collapsed = query.replace(/ /g, "");
  if (keywords.some((keyword) => keyword.replace(/ /g, "") === collapsed)) return 800;

  const wordStart = padded.indexOf(` ${query}`);
  if (wordStart >= 0) return 700 - Math.min(wordStart, 50);

  if (name.includes(query)) return 400;

  // `actionbutton` — the name typed as one word, which no separator-splitting tier catches.
  if (name.replace(/ /g, "").includes(query.replace(/ /g, ""))) return 300;

  if (terms.every((term) => name.includes(term))) return 200;

  // `시트` against a `메뉴 시트` keyword, padded the way the name tiers pad. Matching anywhere
  // inside instead would make `액션` a hit on `리액션` and `텍스트` one on `컨텍스트`: Korean
  // writes a compound as one word, so its parts swallow other words whole.
  if (keywords.some((keyword) => ` ${keyword} `.includes(` ${query}`))) return 150;

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
