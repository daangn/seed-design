"use client";

import { IconMagnifyingglassLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
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
import { NoResults } from "./no-results";
import { RecentPages } from "./recent-pages";
import { SearchResultItem } from "./search-result-item";
import { SearchResultsState } from "./search-results-state";
import { SearchTags } from "./tags";
import { TokenResults } from "./token-results";
import { koreanTokenizer } from "./tokenizer";
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

  // Tokens live under Foundations, so they only belong in the unfiltered view and in
  // that section's own filter.
  const tokens = useTokenSearch({
    search,
    enabled: tag === undefined || tag === TAGS.foundations.value,
  });

  // Re-rank fumadocs' results before display. Its advanced search flattens title/heading/
  // body into one field with no field or all-terms weighting, so a partial ("Button"-only)
  // body snippet can outrank the "Action Button" pages. Push closer matches up — exact query
  // phrase, then more matched terms, then title/heading over body — keeping orama's order as a
  // stable tie-break. Reordering is safe: the list keys off item.id, not array position.
  const results = useMemo(() => {
    const data = query.data;
    if (data === "empty" || !data) return null;
    const q = search.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    return data
      .map((item, index) => {
        const raw = item.content;
        const text = typeof raw === "string" ? raw.replace(/<\/?mark>/g, "").toLowerCase() : "";
        const phrase = terms.length > 1 && text.includes(q) ? 1 : 0;
        const hits = terms.reduce((n, term) => n + (text.includes(term) ? 1 : 0), 0);
        const kind = item.type === "text" ? 0 : 1; // title/heading above body text
        return { item, index, rank: phrase * 100 + hits * 10 + kind };
      })
      .sort((a, b) => b.rank - a.rank || a.index - b.index)
      .map((entry) => entry.item);
  }, [query.data, search]);

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay className="!bg-bg-overlay !backdrop-blur-none" />
      <SearchDialogContent
        className={clsx(
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
              <TokenResults matches={tokens} search={search} />
              <SearchDialogList
                items={results}
                // The token section already answers the query; a "no results" notice
                // under it would contradict what's on screen.
                Empty={() => (tokens.length > 0 ? null : <NoResults />)}
                Item={(itemProps) => <SearchResultItem {...itemProps} />}
                // Give up most of the 480px budget to the token section when it's
                // showing, so the card stays close to the height the pinned dialog top
                // assumes instead of running off short viewports.
                className={tokens.length > 0 ? "[&>div]:!max-h-[176px]" : "[&>div]:!max-h-[480px]"}
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
