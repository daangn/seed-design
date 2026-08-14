"use client";

import { useSearch } from "fumadocs-ui/components/dialog/search";
import type { ReactNode } from "react";

function Hint({ keys, children }: { keys: string[]; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1">
      {keys.map((key) => (
        <kbd
          key={key}
          className="min-w-5 rounded-md border border-stroke-neutral-muted bg-bg-layer-default px-1 py-px text-center font-sans text-[11px] leading-[1.4] text-fg-neutral-muted"
        >
          {key}
        </kbd>
      ))}
      {children}
    </span>
  );
}

/**
 * Keyboard hints along the bottom of the results card. Hidden below `md`, where there is no
 * keyboard to press and the dialog needs the height more.
 *
 * The move and open hints appear only once something is typed: they drive fumadocs' result
 * list (`SearchDialogList` binds the keys), and with no query that list is empty — the recent
 * pages standing in for it are plain links the arrows never reach.
 */
export function SearchFooter() {
  const { search } = useSearch();

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-stroke-neutral-muted px-3 py-2 text-xs text-fg-neutral-subtle max-md:hidden">
      {search.trim() === "" ? null : (
        <>
          <Hint keys={["↑", "↓"]}>이동</Hint>
          <Hint keys={["Enter"]}>열기</Hint>
        </>
      )}
      <Hint keys={["Esc"]}>닫기</Hint>
    </div>
  );
}
