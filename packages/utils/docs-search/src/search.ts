import { type RawData, create, getByID, load, search } from "zbsearch";
import { koreanTokenizer } from "./tokenizer";

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

      return mergeByPage(all, any).slice(0, settings.limit);
    },
  };
}

/**
 * Appends the pages of `fill` that `base` did not already open, keeping each page's own rows
 * together. A page is the unit because a heading torn from its page reads as a second result
 * for the same document.
 */
function mergeByPage(base: SearchHit[], fill: SearchHit[]): SearchHit[] {
  const opened = new Set(base.filter((hit) => hit.type === "page").map((hit) => hit.url));
  const tail: SearchHit[] = [];
  let keeping = false;

  for (const hit of fill) {
    if (hit.type === "page") keeping = !opened.has(hit.url);
    if (keeping) tail.push(hit);
  }

  return [...base, ...tail];
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
