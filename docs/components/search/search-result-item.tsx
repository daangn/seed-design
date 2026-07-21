"use client";

import type { SearchItemType } from "fumadocs-ui/components/dialog/search";
import { useSearchList } from "fumadocs-ui/components/dialog/search";
import { type ReactNode, type Ref, useEffect, useRef } from "react";
import { ListButtonItem, ListLinkItem } from "seed-design/ui/list";
import { sectionLabel } from "@/lib/docs-sections";

/**
 * fumadocs wraps the matched query terms in `<mark>…</mark>` inside the result content
 * string. Render those as highlighted chunks — reusing the global ::selection lime via the
 * `--selection-*` vars — and leave everything else as plain text.
 */
function renderContent(content: ReactNode): ReactNode {
  if (typeof content !== "string") return content;
  // split() with a capture group interleaves plain text with the matched terms:
  // [plain, match, plain, match, …] — odd indices are the highlighted terms.
  return content.split(/<mark>(.*?)<\/mark>/g).map((chunk, i) =>
    i % 2 === 1 ? (
      <mark key={`${i}-${chunk}`} className="bg-[var(--selection-bg)] text-[var(--selection-fg)]">
        {chunk}
      </mark>
    ) : (
      chunk
    ),
  );
}

/**
 * A single search result rendered with the SEED List snippet (`ListLinkItem`). Wired to
 * fumadocs' `useSearchList()`: the keyboard-active row gets List Item's own neutral
 * hover/pressed background via `data-hover` (no brand `highlighted` variant) and scrolls
 * into view. Pass this via SearchDialogList's `Item` prop.
 */
export function SearchResultItem({ item, onClick }: { item: SearchItemType; onClick: () => void }) {
  const { active, setActive } = useSearchList();
  const isActive = item.id === active;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isActive) ref.current?.scrollIntoView({ block: "nearest" });
  }, [isActive]);

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

  return (
    <ListLinkItem
      ref={ref as Ref<HTMLAnchorElement>}
      href={item.url}
      title={renderContent(item.content)}
      // The static advanced index has no breadcrumbs, so derive the section from the URL.
      detail={sectionLabel(item.url) || undefined}
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
