"use client";

import {
  IconCheckmarkClipboardLine,
  IconSquare2StackedLine,
} from "@karrotmarket/react-monochrome-icon";
import { Icon } from "@seed-design/react";
import { clsx } from "cn";
import { type MouseEvent, useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  /** Extra classes — used for the floating (title-less) placement. */
  className?: string;
}

/**
 * Copies the currently visible `<pre>` inside the enclosing `[data-code-card]`.
 * Works for both single blocks and tabbed blocks (picks the visible tab panel).
 */
export function CopyButton({ className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Clear the pending "copied → idle" reset if the button unmounts first
  // (avoids a setState on an unmounted component).
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const card = event.currentTarget.closest<HTMLElement>("[data-code-card]");
    if (!card) return;

    const pres = Array.from(card.querySelectorAll<HTMLElement>("pre"));
    const pre = pres.find((el) => el.offsetParent !== null) ?? pres[0];
    if (!pre) return;

    const clone = pre.cloneNode(true) as HTMLElement;
    for (const node of clone.querySelectorAll(".nd-copy-ignore")) {
      node.replaceWith("\n");
    }
    void navigator.clipboard.writeText(clone.textContent ?? "");

    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? "코드가 복사되었습니다" : "코드 복사"}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-r1 p-x1 text-fg-neutral-muted transition-colors hover:bg-bg-neutral-weak-pressed",
        className,
      )}
    >
      <Icon
        svg={copied ? <IconCheckmarkClipboardLine /> : <IconSquare2StackedLine />}
        size="x4"
        color="fg.neutralMuted"
      />
    </button>
  );
}
