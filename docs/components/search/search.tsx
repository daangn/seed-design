"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import type { SortedResult } from "fumadocs-core/search";
import { useDocsSearch } from "fumadocs-core/search/client";
import { staticClient } from "fumadocs-core/search/client/orama-static";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import {
  SearchDialog,
  SearchDialogContent,
  SearchDialogOverlay,
} from "fumadocs-ui/components/dialog/search";
import type { SharedProps, TagItem } from "fumadocs-ui/contexts/search";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { TAGS } from "@/app/api/search/constants";
import { useRecentPages } from "@/hooks/useRecentPages";
import { ComponentResults } from "./component-results";
import { SearchFooter } from "./footer";
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

  /** Extra classes for the dialog panel (e.g. landing overrides its mobile position). */
  contentClassName?: string;

  /** Pin the dialog to the light palette, for pages that are light-only themselves. */
  lightOnly?: boolean;
}

/**
 * Overlay and panel portal to <body>, so a light-only page can't contain them — each pins
 * itself. SEED pairs `color-scheme: light only` with the light tokens under this attribute,
 * which is what keeps the parts the browser paints — scrollbar, caret, autofill — out of dark.
 */
const LIGHT_ONLY_PROPS = { "data-seed-color-mode": "light-only" };

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

/**
 * The field keeps the focus the whole time the dialog is open — the arrow keys move a
 * highlight through the results rather than the focus, which is what lets someone keep typing
 * after they have moved. Base UI owns the input itself for that reason; the pill around it is
 * ours.
 */
function SearchInputPill() {
  return (
    <div className={SEARCH_INPUT_PILL_CLASS_NAME}>
      <IconMagnifyingglassLine className="size-6 shrink-0 text-fg-neutral-subtle max-md:size-[18px]" />
      <Autocomplete.Input
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
  const groups: { rows: SortedResult[]; rank: number; headed: boolean }[] = [];
  const nested = new Set<string>();

  for (const item of items) {
    const rank = rankRow(item, query, terms);
    const current = groups.at(-1);
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

/**
 * Components, tokens and documents scroll together in one box rather than each clipping
 * itself. Every block is then as tall as its own content, and what doesn't fit the first
 * screenful is reached by scrolling past the block above it — where three nested scroll
 * areas instead had to divide a fixed height between them, and any block that outgrew its
 * share got cut mid-card. Each block caps how many entries it lays out (`…_RESULT_LIMIT`),
 * which is what keeps the one above from burying the ones below.
 */
const RESULTS_CLASS_NAME = "max-h-[480px] overflow-y-auto";

/** Gap that opens a new block. Every row that isn't indented under a header starts one. */
const BLOCK_START_CLASS_NAME = "[&:not(:first-child)]:mt-2";

export default function DefaultSearchDialog({
  defaultTag,
  tags = [],
  api,
  contentClassName,
  lightOnly,
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
  const { matches: components, pending: componentsPending } = useComponentSearch({
    search,
    enabled: tag === undefined || tag === TAGS.components.value,
  });
  const { matches: tokens, pending: tokensPending } = useTokenSearch({
    search,
    enabled: tag === undefined || tag === TAGS.foundations.value,
  });

  const results = useMemo(() => {
    const data = query.data;
    if (data === "empty" || !data) return null;

    return rankGroups(data, search);
  }, [query.data, search]);

  // Every block waits for the slowest of the three, so they arrive together rather than one
  // after another, shifting the grid under someone already reading it.
  const isLoading = query.isLoading || componentsPending || tokensPending;

  // Read here rather than inside the block below, because the footer's hints turn on what the
  // list holds and the empty state's rows are these.
  const recentPages = useRecentPages();

  // Mirrors what `SearchResultsState` puts on screen. Loading, failing and finding nothing all
  // leave the arrows nowhere to go, which is what the hints are answering for.
  const hasItems =
    search.trim() === ""
      ? recentPages.length > 0
      : !query.error &&
        !isLoading &&
        (components.length > 0 || tokens.length > 0 || (results?.rows.length ?? 0) > 0);

  // One box holds every block, so a query answered further down than the last one would open
  // already scrolled past the components promoted above it.
  const resultsRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: `results` is what the reset reacts to, not a value it reads
  useEffect(() => {
    resultsRef.current?.scrollTo({ top: 0 });
  }, [results]);

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay
        className={clsx(DIALOG_LAYER_CLASS_NAME, "!bg-bg-overlay !backdrop-blur-none")}
        {...(lightOnly && LIGHT_ONLY_PROPS)}
      />
      <SearchDialogContent
        {...(lightOnly && LIGHT_ONLY_PROPS)}
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
        {/* `inline` leaves the popup, its focus trap and its scroll lock unrendered — the
            dialog around it already owns all three — and keeps only what the results need:
            the arrow keys, the highlight and the ARIA that ties them to the field. `grid`
            reads the rows from the markup, which is how blocks of three, four and one share
            one run of keys. Filtering stays ours (`mode="none"`), and binding `open` to the
            dialog's is what clears the highlight when it closes. */}
        <Autocomplete.Root
          inline
          grid
          mode="none"
          open={props.open}
          onOpenChange={props.onOpenChange}
          value={search}
          onValueChange={setSearch}
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
                isLoading={isLoading}
                recent={<RecentPages pages={recentPages} />}
              >
                <Autocomplete.List ref={resultsRef} className={RESULTS_CLASS_NAME}>
                  <ComponentResults matches={components} search={search} />
                  <TokenResults matches={tokens} search={search} />
                  <div className="p-1">
                    {/* The promoted blocks already answer the query; a "no results" notice
                        under them would contradict what's on screen. */}
                    {results?.rows.length === 0 &&
                    components.length === 0 &&
                    tokens.length === 0 ? (
                      <NoResults />
                    ) : null}
                    {results?.rows.map((row) => {
                      const nested = results.nested.has(row.id);
                      return (
                        <Autocomplete.Row
                          key={row.id}
                          className={clsx(!nested && BLOCK_START_CLASS_NAME)}
                        >
                          {/* Under a filter every result already belongs to the chosen
                              section, so the trail would open with the chip's own word on
                              every group. */}
                          <SearchResultItem
                            item={row}
                            showSection={tag === undefined}
                            nested={nested}
                          />
                        </Autocomplete.Row>
                      );
                    })}
                  </div>
                </Autocomplete.List>
              </SearchResultsState>
              <SearchFooter hasItems={hasItems} />
            </div>
          </div>
        </Autocomplete.Root>
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
 * DefaultSearchDialogProps (no `contentClassName` or `lightOnly`), so the landing injects its
 * mobile position and its palette here via the SearchDialog component instead of via `options`.
 */
export function LandingSearchDialog(props: SharedProps) {
  return <DefaultSearchDialog {...props} contentClassName={LANDING_MOBILE_POSITION} lightOnly />;
}
