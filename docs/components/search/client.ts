import { createDocsSearch } from "@seed-design/docs-search";
import { createContentHighlighter } from "fumadocs-core/search";
import type { SearchClient } from "fumadocs-core/search/client";
import type { RankedResult } from "./rank-groups";

/**
 * The dialog's search client, standing in for fumadocs' own `staticClient`.
 *
 * What it swaps is where the query is answered: `@seed-design/docs-search` holds the
 * tokenizer and the ranking, so the CLI and the MCP server answer the same query the same
 * way. What stays fumadocs' is the highlighting — `<mark>` around the matched words is what
 * `result-markdown.tsx` renders, and only this dialog needs it.
 */

const loading = new Map<string, Promise<ReturnType<typeof createDocsSearch>>>();

/** One fetch and one parse per index URL, however many times the dialog opens. */
function load(api: string) {
  const started = loading.get(api);
  if (started) return started;

  const pending = fetch(api).then(async (response) => {
    if (!response.ok) throw new Error(`검색 인덱스를 가져오지 못했어요: ${api}`);

    return createDocsSearch(await response.json());
  });

  loading.set(api, pending);
  return pending;
}

export function docsSearchClient({ api, tag }: { api: string; tag?: string }): SearchClient {
  return {
    deps: [tag],
    async search(query) {
      const highlighter = createContentHighlighter(query);
      const hits = await (await load(api)).search(query, { ...(tag && { tag: [tag] }) });

      return hits.map(
        (hit): RankedResult => ({
          id: hit.id,
          // fumadocs knows three row types, so the when-to-read line goes as the body text it
          // ranks as, marked for `rankGroups` to leave off the list.
          type: hit.type === "when-to-read" ? "text" : hit.type,
          ...(hit.type === "when-to-read" && { rankOnly: true }),
          url: hit.url,
          content: highlighter.highlightMarkdown(hit.content),
          ...(hit.breadcrumbs && { breadcrumbs: hit.breadcrumbs }),
        }),
      );
    },
  };
}
