"use client";

import { IconSquare2StackedLine } from "@karrotmarket/react-monochrome-icon";
import * as React from "react";

interface CopyableNameProps {
  /** The text to display and copy */
  name: string;
  /** Optional highlighted HTML (dangerouslySetInnerHTML) */
  highlightedHtml?: string;
  /** Additional class name for the text */
  className?: string;
}

export const CopyableName = ({ name, highlightedHtml, className }: CopyableNameProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: noop
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={[
        "group/copy inline-flex items-center gap-1.5 rounded-md px-2 py-1 -mx-2 -my-1",
        "transition-colors duration-150",
        "hover:bg-fd-muted/60",
        "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title="클릭하여 복사"
    >
      {highlightedHtml ? (
        <span dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      ) : (
        <span>{name}</span>
      )}
      <span
        className={[
          "inline-flex items-center transition-opacity duration-150",
          "opacity-0 group-hover/copy:opacity-100",
        ].join(" ")}
      >
        {copied ? (
          <CheckIcon className="size-4 text-seed-fg-positive" />
        ) : (
          <IconSquare2StackedLine className="size-4 text-fd-muted-foreground" />
        )}
      </span>
    </button>
  );
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
