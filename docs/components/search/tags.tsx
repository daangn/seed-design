"use client";

import clsx from "clsx";
import type { TagItem } from "fumadocs-ui/contexts/search";
import type { ReactNode } from "react";

/** Pill-shaped filter chip. `undefined` value == the "All" (no filter) chip. */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        "shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-bg-neutral-solid text-fg-neutral-inverted"
          : "bg-bg-transparent-selected text-fg-neutral hover:bg-bg-transparent-selected-pressed",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Section filter row. `All` clears the filter (searches everything); each tag maps to a
 * header section. Chips are real buttons (Tab-focusable, aria-pressed) unlike fumadocs'
 * TagsListItem, which is tabIndex=-1.
 */
export function SearchTags({
  tag,
  onTagChange,
  tags,
  className,
}: {
  tag: string | undefined;
  onTagChange: (tag: string | undefined) => void;
  tags: TagItem[];
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="검색 필터"
      className={clsx("flex flex-wrap items-center gap-1.5", className)}
    >
      <Chip active={tag === undefined} onClick={() => onTagChange(undefined)}>
        All
      </Chip>
      {tags.map((item) => (
        <Chip key={item.value} active={tag === item.value} onClick={() => onTagChange(item.value)}>
          {item.name}
        </Chip>
      ))}
    </div>
  );
}
