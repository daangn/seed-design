"use client";

import { IconCheckmarkFill, IconCheckmarkClipboardLine } from "@karrotmarket/react-monochrome-icon";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";

export function CopyValue({ value }: { value: string }) {
  const [copied, onClick] = useCopyButton(() => {
    navigator.clipboard.writeText(value);
  });

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className="flex items-center gap-1 group/copy"
    >
      <span>{value}</span>
      {copied ? (
        <IconCheckmarkFill size={12} className="flex-none" />
      ) : (
        <IconCheckmarkClipboardLine
          size={12}
          className="flex-none opacity-0 group-hover/copy:opacity-100 transition-opacity text-fd-muted-foreground"
        />
      )}
    </button>
  );
}
