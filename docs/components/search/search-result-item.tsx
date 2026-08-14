"use client";

import type { SearchItemType } from "fumadocs-ui/components/dialog/search";
import { useSearchList } from "fumadocs-ui/components/dialog/search";
import { type Ref, useEffect, useRef } from "react";
import { ListButtonItem, ListLinkItem } from "seed-design/ui/list";
import { sectionLabel } from "@/lib/docs-sections";
import { ResultMarkdown } from "./result-markdown";

/**
 * Indent for the rows matched inside a document, measured from the row's own gutter so the
 * List Item recipe stays the single source for the outer padding. Inline rather than a
 * utility class because that recipe is unlayered and would win over `@layer utilities`.
 */
const NESTED_ROW_STYLE = {
  paddingInlineStart:
    "calc(var(--seed-dimension-spacing-x-global-gutter) + var(--seed-dimension-x4))",
};

/** Gap that opens a new block. Every row that isn't indented under a header starts one. */
const BLOCK_START_CLASS_NAME = "[&:not(:first-child)]:mt-2";

/**
 * A single search result rendered with the SEED List snippet (`ListLinkItem`). Wired to
 * fumadocs' `useSearchList()`: the keyboard-active row gets List Item's own neutral
 * hover/pressed background via `data-hover` (no brand `highlighted` variant) and scrolls
 * into view. Pass this via SearchDialogList's `Item` prop.
 *
 * Advanced search hands the list one `page` row per matched document followed by the rows
 * that matched inside it, so a `page` row renders as the group's header — the document title,
 * and the section it sits in — and the rest render indented beneath the header they belong to.
 */
export function SearchResultItem({
  item,
  onClick,
  showSection,
  nested,
  autoActive,
}: {
  item: SearchItemType;
  onClick: () => void;

  /** Section label on group headers. Off under a filter, where it would repeat the chip. */
  showSection: boolean;

  /** Whether a header row above owns this one. Decided by the caller, which knows which
   * headers a component card replaced. */
  nested: boolean;

  /** Whether the list activates this row on its own — it does that to the first one of every
   * result set, without the reader having moved anywhere. */
  autoActive: boolean;
}) {
  const { active, setActive } = useSearchList();
  const isActive = item.id === active;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only rows the reader moved to scroll themselves in. The first row of a result set is
    // activated for them, and the promoted cards sharing this scroll box sit above it — so
    // pulling it into view would sweep them off the top before they had been looked at.
    if (isActive && !autoActive) ref.current?.scrollIntoView({ block: "nearest" });
  }, [isActive, autoActive]);

  // Drive List Item's built-in hover styling for the keyboard-active row (desktop uses
  // [data-hover], touch uses [data-active]). No brand highlight.
  const activation = {
    "aria-selected": isActive,
    "data-hover": isActive ? "" : undefined,
    "data-active": isActive ? "" : undefined,
    onPointerMove: () => setActive(item.id),
  };

  if (item.type === "action") {
    return (
      <ListButtonItem
        ref={ref as Ref<HTMLButtonElement>}
        title={item.node}
        onClick={onClick}
        {...activation}
      />
    );
  }

  const isHeader = item.type === "page";
  const title =
    typeof item.content === "string" ? (
      <ResultMarkdown>{item.content}</ResultMarkdown>
    ) : (
      item.content
    );

  return (
    <ListLinkItem
      ref={ref as Ref<HTMLAnchorElement>}
      href={item.url}
      title={isHeader ? <span className="font-medium">{title}</span> : title}
      // The static advanced index has no breadcrumbs, so derive the section from the URL.
      suffix={isHeader && showSection ? sectionLabel(item.url) || undefined : undefined}
      // Indented rows belong to the header above them; everything else — a header, or a row
      // whose header a card replaced — starts a block of its own.
      rootProps={nested ? { style: NESTED_ROW_STYLE } : { className: BLOCK_START_CLASS_NAME }}
      onClick={(e) => {
        // Route through fumadocs' onSelect (client-side push + close). Keep href for
        // semantics and cmd/ctrl-click to open in a new tab.
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        onClick();
      }}
      {...activation}
    />
  );
}
