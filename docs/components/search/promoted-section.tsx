"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import clsx from "clsx";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import { type ReactNode, useState } from "react";
import { splitHighlights } from "@/lib/search-text";

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

/**
 * Cuts a block's entries into the lines the arrow keys read. Base UI works out what sits
 * above, below and beside a cell from `role="row"` ancestors rather than from the CSS, so a
 * block lays itself out as a column of rows rather than as one box the browser wraps on its
 * own — otherwise every entry would count as one endless row and ↑↓ would have nowhere to go.
 *
 * The size is the desktop column count. Below `md` the grid narrows and a row stops being one
 * line of its own, which is also where there is no keyboard to press — the hints hide
 * themselves there.
 */
export function toRows<T>(entries: T[], columns: number) {
  const rows: T[][] = [];

  for (const entry of entries) {
    const current = rows.at(-1);
    if (current && current.length < columns) current.push(entry);
    else rows.push([entry]);
  }

  return rows;
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
    <Autocomplete.Row>
      <Autocomplete.Item
        // A value of its own, unlike the rows around it, because an item left without one
        // holds `null` — and `null` is also what a list that selects nothing has selected, so
        // this row would answer to it and the arrow keys would start here instead of at the
        // top of the block.
        value={expanded ? "collapse" : "expand"}
        // Base UI reads a click on an item as choosing it, and choosing closes the popup —
        // which here is the whole dialog. This one only unfolds the block above it, so its
        // handler is stopped and the toggle runs on its own.
        onClick={(event) => {
          event.preventBaseUIHandler();
          onToggle();
        }}
        className={(state) =>
          clsx(
            "mt-1.5 w-full cursor-pointer rounded-lg py-1.5 text-center text-xs transition-colors",
            state.highlighted
              ? "bg-bg-transparent-pressed text-fg-neutral"
              : "text-fg-neutral-subtle",
          )
        }
      >
        {expanded ? "접기" : `${hidden}개 더 보기`}
      </Autocomplete.Item>
    </Autocomplete.Row>
  );
}

/**
 * A block of results promoted above the document list — components, tokens — introduced by
 * what it holds and how many of them the query matched.
 *
 * Boxes without a role of their own, rather than the `Group`/`GroupLabel` pair this reads
 * like: a grid takes rows, and a group between it and them leaves the rows inside without the
 * parent their own role requires — so the whole block drops out of the grid the arrow keys are
 * walking. A plain box is passed straight through instead, which is what the document block
 * below already relies on. The cost is that the label names the rows by sitting in front of
 * them rather than by being tied to them.
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
    <div className="border-b border-stroke-neutral-muted p-3 pb-2">
      <div className="px-0.5 pb-2 text-xs font-medium text-fg-neutral-muted">
        {label} <span className="text-fg-neutral-subtle">{count}개</span>
      </div>
      {/* A card carries 6px of padding inside its own ground, against the 2px the label is
          inset by, so cards laid out plainly within the section's padding sit their covers
          4px right of the label above them — and of the document rows further down, which
          start on the label's line. Pulling the block back by that much puts the three on
          one line and leaves the grounds to overhang, as they already did. */}
      <div className="-mx-1">{children}</div>
    </div>
  );
}
