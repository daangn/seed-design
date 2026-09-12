import { type RawData, create, insertMultiple, save } from "zbsearch";
import { koreanTokenizer } from "./tokenizer";

/**
 * Building the index the documentation site publishes at `/api/search.json`.
 *
 * fumadocs builds one too, and this replaces it for one reason: its row shape is a fixed
 * constant, and a page's title reaches it only as the text of the page's own row. zbsearch
 * weights per property, so a title buried in `content` is a title no boost can address — it
 * competes with body prose on equal terms, and the page a query names by name loses to any
 * paragraph that happens to say the same words more often.
 *
 * Owning the build is what lets `title` be a property. Everything else about the rows follows
 * fumadocs, since the site's search dialog, the CLI and the MCP server all read them.
 */

/**
 * The properties `search.ts` searches, filters and groups by, and no others.
 *
 * Rows also carry `url`, `type` and `breadcrumbs`. zbsearch stores a document whole whether or
 * not it indexes a property, so those still reach every result; indexing them would serve no
 * query and grow the published dump toward the 25 MiB Cloudflare Pages accepts per file.
 */
export const DOCS_SCHEMA = {
  content: "string",
  page_id: "string",
  tags: "enum[]",
  title: "string",
} as const;

/**
 * What both sides open the database with, so the dump `buildDocsIndex` writes is the one
 * `search.ts` reads.
 *
 * Sorting is off. Results come back in relevance order, and a sort index per string property is
 * megabytes of dump no query reads.
 */
export const DOCS_DB_OPTIONS = {
  schema: DOCS_SCHEMA,
  components: { tokenizer: koreanTokenizer },
  sort: { enabled: false },
};

/** The extract of a page this index is built from, matching fumadocs' `AdvancedIndex`. */
export interface IndexablePage {
  id: string;
  url: string;
  title: string;
  description?: string;
  breadcrumbs?: string[];
  tag?: string;
  structuredData: {
    headings: { id: string; content: string }[];
    contents: { heading?: string; content: string }[];
  };
}

/**
 * Flattens a page into the rows that answer for it.
 *
 * A heading and a chunk each get their own row so a result can name the section it matched.
 * Only the page's own row carries `title`: results are grouped by page, so one boosted row is
 * all it takes to lift the page, while repeating the name down every row weights a page by
 * how many chunks it was cut into — which is how a long changelog comes to outrank the page
 * it merely mentions.
 */
function rowsOf(page: IndexablePage) {
  const shared = {
    page_id: page.id,
    title: "",
    breadcrumbs: page.breadcrumbs ?? [],
    tags: page.tag ? [page.tag] : [],
  };

  let sequence = 0;
  const nextId = () => `${page.id}-${sequence++}`;

  return [
    { ...shared, id: page.id, type: "page", url: page.url, content: page.title, title: page.title },
    ...(page.description
      ? [{ ...shared, id: nextId(), type: "text", url: page.url, content: page.description }]
      : []),
    ...page.structuredData.headings.map((heading) => ({
      ...shared,
      id: nextId(),
      type: "heading",
      url: `${page.url}#${heading.id}`,
      content: heading.content,
    })),
    ...page.structuredData.contents.map((chunk) => ({
      ...shared,
      id: nextId(),
      type: "text",
      url: chunk.heading ? `${page.url}#${chunk.heading}` : page.url,
      content: chunk.content,
    })),
  ];
}

/** What a hit's document holds: every field `rowsOf` writes, the unindexed ones included. */
export type DocsRow = ReturnType<typeof rowsOf>[number];

/** The dump to publish, ready to be served as JSON and read back by `createDocsSearch`. */
export async function buildDocsIndex(pages: IndexablePage[]): Promise<RawData> {
  const db = create(DOCS_DB_OPTIONS);
  await insertMultiple(db, pages.flatMap(rowsOf), 1000);

  return save(db);
}
