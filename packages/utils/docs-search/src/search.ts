import { type RawData, create, getByID, load, search } from "zbsearch";
import { koreanTokenizer, tokenize } from "./tokenizer";

/** The dump shape `createDocsSearch` takes, re-exported so callers can name what they fetched. */
export type { RawData } from "zbsearch";

/**
 * Querying the static search index the documentation site publishes at `/api/search`.
 *
 * The index is a zbsearch database dump built by fumadocs at site build time. Everything here
 * exists so that the site, the CLI and the MCP server reach it the same way: one tokenizer,
 * one set of query parameters, one ranking. A second implementation anywhere would answer the
 * same question differently, and nothing would report the disagreement.
 */

/** The row shape fumadocs indexes: one per page, plus one per heading and per text chunk. */
const schema = {
  content: "string",
  page_id: "string",
  type: "string",
  url: "string",
  breadcrumbs: "string[]",
  tags: "enum[]",
} as const;

export interface SearchHit {
  id: string;
  /** `page` opens each group; the `heading` and `text` rows under it carry a `#` anchor. */
  type: "page" | "heading" | "text";
  /** Raw index text. Highlighting is the caller's business — a terminal wants none of it. */
  content: string;
  url: string;
  breadcrumbs?: string[];
}

export interface SearchOptions {
  /** Section filter, matching the `tags` the site indexes each page under. */
  tag?: string[];
  /** Chunks the engine may return. Pages come out of these, so more chunks means more pages. */
  limit?: number;
  /**
   * Chunks kept per page. The site shows several headings under one result and wants 8; a
   * listing of addresses wants 1, since every extra chunk costs a page slot under `limit`.
   */
  maxResultsPerPage?: number;
}

/**
 * Loads a published index dump and hands back the one thing callers need from it.
 *
 * The database itself stays in here. Its type names zbsearch internals that a declaration
 * file cannot reference, and no caller has a reason to hold it.
 */
export function createDocsSearch(dump: RawData) {
  const db = create({ schema, components: { tokenizer: koreanTokenizer } });
  load(db, dump);

  async function runPass(
    query: string,
    { tag, limit, maxResultsPerPage }: SearchOptions,
    threshold: number | undefined,
  ) {
    const result = await search(db, {
      limit,
      mode: "fulltext",
      properties: ["content"],
      groupBy: { properties: ["page_id"], maxResult: maxResultsPerPage },
      ...(query.length > 0 && { term: query }),
      ...(tag && tag.length > 0 && { where: { tags: { containsAll: tag } } }),
      ...(threshold !== undefined && { threshold }),
    });

    const hits: SearchHit[] = [];

    for (const group of result.groups ?? []) {
      const pageId = group.values[0];
      const page = typeof pageId === "string" ? getByID(db, pageId) : undefined;
      if (!page) continue;

      hits.push({
        id: page.url,
        type: "page",
        content: page.content,
        url: page.url,
        ...(page.breadcrumbs && { breadcrumbs: page.breadcrumbs }),
      });

      for (const hit of group.result) {
        if (hit.document.type === "page") continue;

        hits.push({
          id: hit.id,
          type: hit.document.type === "heading" ? "heading" : "text",
          content: hit.document.content,
          url: hit.document.url,
          ...(hit.document.breadcrumbs && { breadcrumbs: hit.document.breadcrumbs }),
        });
      }
    }

    return hits;
  }

  return {
    /**
     * Two passes, merged: documents carrying every word of the query first, then the rest.
     *
     * zbsearch's `threshold` is not a minimum score despite what its types say — it is the
     * ratio between requiring all query tokens and requiring one. Left at its default a query
     * is an OR, so one common word ("확인", "화면") drags in documents that match nothing else
     * and outranks the document that matches everything. Running the AND pass first and
     * letting OR fill in behind it keeps that precision without losing recall: measured over
     * 180 queries, top-1 went 7.2% → 10.0% and MRR 0.151 → 0.172, miss rate unchanged.
     */
    async search(query: string, options: SearchOptions = {}) {
      const settings = { limit: 60, maxResultsPerPage: 8, ...options };

      const [all, any] = await Promise.all([
        runPass(query, settings, 0),
        runPass(query, settings, undefined),
      ]);

      return titleFirst(mergeByPage(all, any), query).slice(0, settings.limit);
    },
  };
}

/**
 * How far the loose pass may extend the strict one, counted in pages.
 *
 * Splitting identifiers turned `action-button` into two words, and a two-word query the loose
 * pass answers with every page holding either of them — 61 pages for that one, against 8
 * before. Elasticsearch spends `minimum_should_match` on the same problem.
 *
 * The ratio alone is not enough, because it tightens exactly where it should loosen: the
 * longer the query, the fewer chunks hold every word of it, so a four-word question like
 * "action button disabled loading" leaves the strict pass with two pages and the loose one
 * with six slots. The floor is what keeps such a query answerable. Measured over 916 queries,
 * the ratio on its own drops answer coverage for long queries from 100% to 97.8%; a floor of
 * ten restores it while still returning 38.6 pages against 69.8 unbounded.
 */
const FILL_RATIO = 3;
const FILL_FLOOR = 10;

/**
 * Appends the pages of `fill` that `base` did not already open, keeping each page's own rows
 * together. A page is the unit because a heading torn from its page reads as a second result
 * for the same document.
 */
function mergeByPage(base: SearchHit[], fill: SearchHit[]): SearchHit[] {
  const opened = new Set(base.filter((hit) => hit.type === "page").map((hit) => hit.url));

  // Nothing carried every word of the query, so the loose pass is the whole answer and keeps
  // its length. Bounding it against zero would leave the reader with nothing.
  const room =
    opened.size === 0 ? Number.POSITIVE_INFINITY : Math.max(opened.size * FILL_RATIO, FILL_FLOOR);

  const tail: SearchHit[] = [];
  let taken = 0;
  let keeping = false;

  for (const hit of fill) {
    if (hit.type === "page") {
      keeping = !opened.has(hit.url) && taken < room;
      if (keeping) taken += 1;
    }
    if (keeping) tail.push(hit);
  }

  return [...base, ...tail];
}

/**
 * A page the query named goes first: exactly, ahead of merely.
 *
 * The engine cannot express this on its own. fumadocs fixes the index schema, so a title
 * reaches the index as one row's content rather than as a field a boost could reach, and a
 * heading row that matches outranks the page whose own name matches.
 *
 * A name only counts when the query accounts for all of it, and when it is at least half of
 * what was asked. Both halves earn their place: without the first, a query is answered by
 * pages named after one word of it; without the second, "Accordion" appearing in a sentence
 * promotes the Accordion page over the document that sentence belongs to, which costs Korean
 * prose queries eight points. Half is what lets "action button disabled loading" find the
 * action button.
 *
 * The order the engine gave decides everything the title leaves tied.
 */
function titleFirst(hits: SearchHit[], query: string): SearchHit[] {
  const wanted = tokenize(query);
  if (wanted.length === 0) return hits;

  const pages: SearchHit[][] = [];
  for (const hit of hits) {
    if (hit.type === "page" || pages.length === 0) pages.push([]);
    pages[pages.length - 1].push(hit);
  }

  return pages
    .map((page, index) => {
      const title = new Set(tokenize(page[0].content));
      const named = title.size > 0 && Array.from(title).every((token) => wanted.includes(token));

      return {
        page,
        index,
        rank: named
          ? title.size === wanted.length
            ? 2
            : Number(title.size * 2 >= wanted.length)
          : 0,
      };
    })
    .sort((a, b) => b.rank - a.rank || a.index - b.index)
    .flatMap(({ page }) => page);
}

/**
 * One ranked address per document. Where a heading matched, its anchor stands in for the bare
 * page address rather than joining it — the anchor says everything the page address does and
 * names the part that matched, so printing both spends two lines saying one thing.
 *
 * Query strings go, since no address grammar accepts one. Dropping them folds the several
 * hundred indexed changelog versions — `/react/updates/changelog?package=…&version=…`, none of
 * them a page of its own — back onto the one page that serves them. They are 21% of an average
 * result set.
 */
export function addressesOf(hits: SearchHit[]): string[] {
  const byPage = new Map<string, string>();

  for (const hit of hits) {
    const address = hit.url.split("?")[0];
    const page = address.split("#")[0];
    const chosen = byPage.get(page);

    if (!chosen || (!chosen.includes("#") && address.includes("#"))) byPage.set(page, address);
  }

  return Array.from(byPage.values());
}
