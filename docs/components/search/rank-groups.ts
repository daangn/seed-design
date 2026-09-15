import type { SortedResult } from "fumadocs-core/search";

/**
 * A result as the dialog receives it. `rankOnly` marks the page's when-to-read line: it counts
 * toward its page's rank like any body text, and is not listed, since it restates the page's
 * frontmatter rather than quoting the page.
 */
export type RankedResult = SortedResult & { rankOnly?: boolean };

/**
 * How close one row sits to the query. Advanced search flattens title, heading and body into
 * a single field with no field or all-terms weighting, so a partial ("Button"-only) body
 * snippet can outrank the "Action Button" page: score the exact phrase first, then how many
 * terms matched, then title/heading over body text.
 */
function rankRow(item: SortedResult, query: string, terms: string[]) {
  const text = item.content.replace(/<\/?mark>/g, "").toLowerCase();
  const phrase = terms.length > 1 && text.includes(query) ? 1 : 0;
  const hits = terms.reduce((n, term) => n + (text.includes(term) ? 1 : 0), 0);
  const kind = item.type === "text" ? 0 : 1;

  return phrase * 100 + hits * 10 + kind;
}

/**
 * Advanced search returns each matched document as a `page` row — whose content is the
 * document title — followed by the heading and body rows that matched inside it. Ranking row
 * by row pulled that apart and sank the `page` rows to the bottom, leaving every snippet with
 * nothing to name the document it came from, so rank whole groups and move each as a unit.
 * Array#sort is stable, which leaves zbsearch's own order as the tie-break, and reordering is
 * safe because the list keys off item.id rather than array position.
 */
export function rankGroups(items: RankedResult[], search: string) {
  const query = search.trim().toLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  const groups: { rows: RankedResult[]; rank: number; headed: boolean }[] = [];
  const nested = new Set<string>();

  for (const item of items) {
    const rank = rankRow(item, query, terms);
    const current = groups.at(-1);

    // It lifts the group it belongs to without joining it, so with no group ahead of it there
    // is nothing for it to do.
    if (item.rankOnly) {
      if (current) current.rank = Math.max(current.rank, rank);
      continue;
    }

    // A `page` row opens the group it heads; one arriving before any of them stands alone.
    if (!current || item.type === "page") {
      groups.push({ rows: [item], rank, headed: item.type === "page" });
      continue;
    }

    // Only a group a `page` row opened has a title for the rest to indent under.
    if (current.headed) nested.add(item.id);
    current.rows.push(item);
    current.rank = Math.max(current.rank, rank);
  }

  return {
    rows: groups.sort((a, b) => b.rank - a.rank).flatMap(({ rows }) => rows),
    nested,
  };
}
