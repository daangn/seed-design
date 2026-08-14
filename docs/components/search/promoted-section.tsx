"use client";

import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { type KeyboardEvent, type ReactNode, useState } from "react";
import { splitHighlights } from "@/lib/search-text";

/**
 * fumadocs' result list binds Enter on `window` to open whichever row it considers
 * active. A focused tile or card would otherwise navigate to that row instead of itself.
 */
export function stopEnterPropagation(event: KeyboardEvent) {
  if (event.key === "Enter") event.stopPropagation();
}

/** Marks the query inside text the section matched itself, rather than via fumadocs. */
export function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  return splitHighlights(text, terms).map((chunk, index) =>
    chunk.match ? (
      <mark
        // biome-ignore lint/suspicious/noArrayIndexKey: chunks are positional, and the list is rebuilt whenever the text or terms change
        key={index}
        className="bg-[var(--selection-bg)] text-[var(--selection-fg)]"
      >
        {chunk.text}
      </mark>
    ) : (
      chunk.text
    ),
  );
}

/**
 * Holds a block to its first `limit` matches until the reader asks for the rest. The result
 * area is one scroll container (`search.tsx`), so a block laying every match out would push
 * the blocks under it past the fold with nothing to say they were there.
 */
export function useExpandable<T>({
  search,
  matches,
  limit,
}: {
  search: string;
  matches: T[];
  limit: number;
}) {
  const [expanded, setExpanded] = useState(false);

  // A new query is a new list; carrying the expansion over would dump hundreds of entries on
  // someone who only added a letter.
  useOnChange(search, () => {
    setExpanded(false);
  });

  return {
    visible: expanded ? matches : matches.slice(0, limit),
    hidden: matches.length - limit,
    expanded,
    toggle: () => setExpanded((current) => !current),
  };
}

/** Reveals what a block's limit held back, and folds it away again. */
export function ShowMore({
  hidden,
  expanded,
  onToggle,
}: {
  hidden: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  if (hidden <= 0) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      onKeyDown={stopEnterPropagation}
      className="mt-1.5 w-full cursor-pointer rounded-lg py-1.5 text-xs text-fg-neutral-subtle transition-colors hover:bg-bg-transparent-selected hover:text-fg-neutral focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-stroke-focus-ring"
    >
      {expanded ? "접기" : `${hidden}개 더 보기`}
    </button>
  );
}

/**
 * A block of results promoted above the document list — components, tokens — introduced by
 * what it holds and how many of them the query matched.
 */
export function PromotedSection({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={`${label} 검색 결과`}
      className="border-b border-stroke-neutral-muted p-3 pb-2"
    >
      <p className="px-0.5 pb-2 text-xs font-medium text-fg-neutral-muted">
        {label} <span className="text-fg-neutral-subtle">{count}개</span>
      </p>
      {children}
    </section>
  );
}
