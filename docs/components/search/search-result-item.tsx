"use client";

import { IconHashLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import type { SearchItemType } from "fumadocs-ui/components/dialog/search";
import { useSearchList } from "fumadocs-ui/components/dialog/search";
import { type Ref, useEffect, useRef } from "react";
import { ResultMarkdown } from "./result-markdown";
import { Breadcrumbs, ROW_ACTIVE_CLASS_NAME, ROW_CLASS_NAME } from "./row";

/** Gap that opens a new block. Every row that isn't indented under a header starts one. */
const BLOCK_START_CLASS_NAME = "[&:not(:first-child)]:mt-2";

/**
 * A single search result. Wired to fumadocs' `useSearchList()`: the keyboard-active row takes
 * the neutral selected background and scrolls itself into view. Pass this via
 * SearchDialogList's `Item` prop.
 *
 * Advanced search hands the list one `page` row per matched document followed by the rows that
 * matched inside it, so a `page` row renders as the group's header — breadcrumbs over the
 * document title — and the rest render beneath it, indented and threaded onto a rail that runs
 * down the group the way fumadocs' own result list draws it.
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

  /** Whether the trail keeps its section. Dropped under a filter, where it repeats the chip. */
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

  const activation = {
    "aria-selected": isActive,
    onPointerMove: () => setActive(item.id),
  };

  const rowClassName = clsx(ROW_CLASS_NAME, isActive && ROW_ACTIVE_CLASS_NAME);

  if (item.type === "action") {
    return (
      <button
        type="button"
        ref={ref as Ref<HTMLButtonElement>}
        onClick={onClick}
        className={clsx(rowClassName, BLOCK_START_CLASS_NAME)}
        {...activation}
      >
        {item.node}
      </button>
    );
  }

  const isHeader = item.type === "page";

  return (
    <a
      ref={ref as Ref<HTMLAnchorElement>}
      href={item.url}
      className={clsx(rowClassName, !nested && BLOCK_START_CLASS_NAME)}
      onClick={(event) => {
        // Route through fumadocs' onSelect (client-side push + close). Keep href for
        // semantics and cmd/ctrl-click to open in a new tab.
        if (event.metaKey || event.ctrlKey) return;

        event.preventDefault();
        onClick();
      }}
      {...activation}
    >
      {isHeader ? (
        <Breadcrumbs trail={(item.breadcrumbs ?? []).slice(showSection ? 0 : 1)} />
      ) : null}
      {/* The rail threads the rows matched inside a document onto the header above them. A row
          whose header a component card replaced has nothing to thread onto, so it draws none. */}
      {nested ? (
        <span aria-hidden className="absolute inset-y-0 start-3 w-px bg-stroke-neutral-muted" />
      ) : null}
      {nested && item.type === "heading" ? (
        <IconHashLine
          aria-hidden
          className="absolute start-6 top-2.5 size-3.5 text-fg-neutral-subtle"
        />
      ) : null}
      <span
        className={clsx(
          "block min-w-0",
          // A heading is a place in the document rather than a sentence from it, so it carries
          // the same weight as the title above it; body text stays quieter than both.
          item.type === "text" ? "text-fg-neutral-muted" : "font-medium",
          nested && (item.type === "heading" ? "ps-8" : "ps-4"),
        )}
      >
        {typeof item.content === "string" ? (
          <ResultMarkdown>{item.content}</ResultMarkdown>
        ) : (
          item.content
        )}
      </span>
    </a>
  );
}
