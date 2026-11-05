"use client";

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
 * All four arrows, because the results are a grid: ↑↓ step between rows and ←→ along one, so
 * a row of component cards is crossed sideways rather than one card at a time. The move and
 * open hints answer for keys that have somewhere to go, so they follow whether the list holds
 * any rows — the recent pages included — rather than whether anything has been typed.
 */
export function SearchFooter({ hasItems }: { hasItems: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-stroke-neutral-muted px-3 py-2 text-xs text-fg-neutral-subtle max-md:hidden">
      {hasItems ? (
        <>
          <Hint keys={["↑", "↓", "←", "→"]}>이동</Hint>
          <Hint keys={["Enter"]}>열기</Hint>
        </>
      ) : null}
      <Hint keys={["Esc"]}>닫기</Hint>
    </div>
  );
}
