"use client";

import { IconCheckmarkFill, IconCheckmarkClipboardLine } from "@karrotmarket/react-monochrome-icon";
import { useState } from "react";

export function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button type="button" onClick={handleCopy} className="flex items-center gap-1 group/copy">
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
