"use client";

import type { KeyboardEvent, ReactNode } from "react";
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
