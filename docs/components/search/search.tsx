"use client";

import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import type { SortedResult } from "fumadocs-core/search";
import { useDocsSearch } from "fumadocs-core/search/client";
import { staticClient } from "fumadocs-core/search/client/orama-static";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import {
  SearchDialog,
  SearchDialogContent,
  SearchDialogList,
  SearchDialogOverlay,
  useSearch,
} from "fumadocs-ui/components/dialog/search";
import type { SharedProps, TagItem } from "fumadocs-ui/contexts/search";
import { type ReactNode, useMemo, useState } from "react";
import { TAGS } from "@/app/api/search/constants";
import { ComponentResults } from "./component-results";
import { NoResults } from "./no-results";
import { RecentPages } from "./recent-pages";
import { SearchResultItem } from "./search-result-item";
import { SearchResultsState } from "./search-results-state";
import { SearchTags } from "./tags";
import { TokenResults } from "./token-results";
import { koreanTokenizer } from "./tokenizer";
import { useComponentSearch } from "./use-component-search";
import { useTokenSearch } from "./use-token-search";
import { create } from "zbsearch";

export interface DefaultSearchDialogProps extends SharedProps {
  /** Section tag preselected when the dialog opens (injected per-section layout). */
  defaultTag?: string;

  tags?: TagItem[];

  /**
   * Search API URL
   */
  api?: string;

  footer?: ReactNode;

  /** Extra classes for the dialog panel (e.g. landing overrides its mobile position). */
  contentClassName?: string;
}

const searchDatabase = create({
  schema: { _: "string" },
  components: {
    tokenizer: koreanTokenizer,
  },
});

const initSearchDatabase = () => searchDatabase;

/**
 * fumadocs ships the dialog at `z-50`. The docs header (`z-40`) sits under that, but the
 * landing chrome does not: its header is `z-[1000]` and the mobile nav panel resolves to
 * 1200 (`--side-panel-z-index: 1100` + `--layer-index: 100`), so both painted over the
 * dialog. Search is the site's topmost modal, so it clears the whole ladder — only the
 * landing custom cursor (`z-[100000]`) stays above it.
 */
const DIALOG_LAYER_CLASS_NAME = "z-[1300]";

/** Search input rendered as a standalone pill above the results card (see mockup). */
export const SEARCH_INPUT_PILL_CLASS_NAME =
  "flex items-center gap-3 rounded-full border border-stroke-neutral-muted bg-bg-layer-floating py-[19.5px] pl-6 pr-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-stroke-focus-ring max-md:py-[14px]";

function SearchInputPill() {
  const { search, onSearchChange } = useSearch();
  return (
    <div className={SEARCH_INPUT_PILL_CLASS_NAME}>
      <IconMagnifyingglassLine className="size-6 shrink-0 text-fg-neutral-subtle max-md:size-[18px]" />
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="검색어를 입력해주세요"
        aria-label="검색어 입력"
        className="t7-regular max-md:t5-regular w-0 flex-1 bg-transparent text-fg-neutral placeholder:text-fg-neutral-subtle focus-visible:outline-none"
      />
    </div>
  );
}

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
function rankGroups(items: SortedResult[], search: string) {
  const query = search.trim().toLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  const groups: { rows: SortedResult[]; rank: number }[] = [];

  for (const item of items) {
    const rank = rankRow(item, query, terms);
    const current = groups.at(-1);
    // A `page` row opens the group it heads; one arriving before any of them stands alone.
    if (!current || item.type === "page") {
      groups.push({ rows: [item], rank });
      continue;
    }

    current.rows.push(item);
    current.rank = Math.max(current.rank, rank);
  }

  return groups.sort((a, b) => b.rank - a.rank).flatMap(({ rows }) => rows);
}

/**
 * Drop the rows the component cards above already answer. A card carries the document's
 * title, cover and platforms, so the `page` row that only repeats the title goes; the rows
 * matched inside the document are deep links no card offers, so they stay — and, having lost
 * the header they were indented under, they stop indenting.
 */
function dropCoveredHeaders(rows: SortedResult[], covered: Set<string>) {
  const kept: SortedResult[] = [];
  const nested = new Set<string>();
  let underHeader = false;

  for (const row of rows) {
    if (row.type === "page") {
      underHeader = !covered.has(row.url);
      if (underHeader) kept.push(row);
      continue;
    }

    if (underHeader) nested.add(row.id);
    kept.push(row);
  }

  return { rows: kept, nested };
}

/**
 * How much of the card is left for the document list once the promoted sections have taken
 * their share. The dialog's top is pinned as if the card were always at its tallest (see
 * `md:!top` below), so a section that appears has to come out of this budget rather than
 * push the card past it. Tokens run 4 tiles wide and cost the most.
 */
const LIST_MAX_HEIGHT = {
  none: "[&>div]:!max-h-[480px]",
  components: "[&>div]:!max-h-[288px]",
  tokens: "[&>div]:!max-h-[176px]",
  both: "[&>div]:!max-h-[120px]",
} as const;

function listMaxHeight(hasComponents: boolean, hasTokens: boolean) {
  if (hasComponents && hasTokens) return LIST_MAX_HEIGHT.both;
  if (hasTokens) return LIST_MAX_HEIGHT.tokens;
  if (hasComponents) return LIST_MAX_HEIGHT.components;

  return LIST_MAX_HEIGHT.none;
}

export default function DefaultSearchDialog({
  defaultTag,
  tags = [],
  api,
  footer,
  contentClassName,
  ...props
}: DefaultSearchDialogProps): ReactNode {
  const [tag, setTag] = useState<string | undefined>(defaultTag);
  const { search, setSearch, query } = useDocsSearch({
    client: staticClient({ initDB: initSearchDatabase, from: api, tag }),
  });

  // Keep the tag in sync when navigating between sections re-mounts with a new defaultTag.
  useOnChange(defaultTag, (v) => {
    setTag(v);
  });

  // Each promoted section belongs to one docs section, so it shows in the unfiltered view
  // and under that section's own filter.
  const components = useComponentSearch({
    search,
    enabled: tag === undefined || tag === TAGS.components.value,
  });
  const tokens = useTokenSearch({
    search,
    enabled: tag === undefined || tag === TAGS.foundations.value,
  });

  const results = useMemo(() => {
    const data = query.data;
    if (data === "empty" || !data) return null;

    return dropCoveredHeaders(
      rankGroups(data, search),
      new Set(components.map((entry) => entry.url)),
    );
  }, [query.data, search, components]);

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay
        className={clsx(DIALOG_LAYER_CLASS_NAME, "!bg-bg-overlay !backdrop-blur-none")}
      />
      <SearchDialogContent
        className={clsx(
          DIALOG_LAYER_CLASS_NAME,
          // Strip fumadocs' single-panel chrome so the pill + card render as two separate
          // surfaces; the inner wrapper below keeps them as one child (avoids the
          // between-children border rule) and stacks them with a gap.
          "!overflow-visible !rounded-none !border-0 !bg-transparent !p-0 !shadow-none",
          // Desktop: pin the top as if the card were always at its max height, so the
          // input pill never shifts as the content (recent / results / no-results)
          // changes size. 316px ≈ half of (input 68 + gap 24 + tags ~59 + results max
          // 480). Widen so all filter chips fit on one row. Mobile keeps fumadocs' top
          // anchor (and the landing override below).
          "!max-w-[720px] md:!top-[max(24px,calc(50%_-_316px))] md:!translate-y-0",
          contentClassName,
        )}
      >
        <div className="flex flex-col gap-6">
          <SearchInputPill />
          <div className="overflow-hidden rounded-2xl border border-stroke-neutral-muted bg-bg-layer-floating">
            <SearchTags
              tag={tag}
              onTagChange={setTag}
              tags={tags}
              className="border-b border-stroke-neutral-muted p-3"
            />
            <SearchResultsState
              search={search}
              error={query.error}
              isLoading={query.isLoading}
              recent={<RecentPages />}
            >
              <ComponentResults matches={components} search={search} compact={tokens.length > 0} />
              <TokenResults matches={tokens} search={search} compact={components.length > 0} />
              <SearchDialogList
                items={results?.rows}
                // The promoted sections already answer the query; a "no results" notice
                // under them would contradict what's on screen.
                Empty={() => (components.length > 0 || tokens.length > 0 ? null : <NoResults />)}
                // Under a filter every result already belongs to the chosen section, so the
                // label would repeat it on every group.
                Item={(itemProps) => (
                  <SearchResultItem
                    {...itemProps}
                    showSection={tag === undefined}
                    nested={results?.nested.has(itemProps.item.id) ?? false}
                  />
                )}
                className={listMaxHeight(components.length > 0, tokens.length > 0)}
              />
            </SearchResultsState>
            {footer}
          </div>
        </div>
      </SearchDialogContent>
    </SearchDialog>
  );
}

// Mobile (<md): drop the landing search panel below the header with the global
// gutter on both sides. Desktop keeps fumadocs' default (centered). `!` overrides
// fumadocs' built-in position classes (left-1/2, top-4, translate, width).
const LANDING_MOBILE_POSITION =
  "max-md:!top-[66px] max-md:!left-[var(--seed-dimension-spacing-x-global-gutter)] max-md:!right-[var(--seed-dimension-spacing-x-global-gutter)] max-md:!bottom-auto max-md:!w-auto max-md:!max-w-none max-md:!translate-x-0 max-md:!translate-y-0";

/**
 * Landing(/) search dialog. RootProvider's `search.options` is typed to fumadocs'
 * DefaultSearchDialogProps (no `contentClassName`), so the landing injects its
 * mobile position here via the SearchDialog component instead of via `options`.
 */
export function LandingSearchDialog(props: SharedProps) {
  return <DefaultSearchDialog {...props} contentClassName={LANDING_MOBILE_POSITION} />;
}
