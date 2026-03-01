"use client";

import { IconSquare2StackedLine } from "@karrotmarket/react-monochrome-icon";
import { useCopyToClipboard } from "./use-copy-to-clipboard";

interface CopyableNameProps {
  name: string;
  label?: string;
  className?: string;
}

export const CopyableName = ({ name, label, className }: CopyableNameProps) => {
  const copy = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(name, label)}
      className={[
        "group/copy inline-flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 -my-1",
        "transition-colors duration-150",
        "hover:bg-fd-muted/60",
        "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title="클릭하여 복사"
    >
      <span className="truncate">{name}</span>
      <IconSquare2StackedLine
        size={14}
        className="shrink-0 text-fd-muted-foreground opacity-0 group-hover/copy:opacity-100 transition-opacity duration-150"
      />
    </button>
  );
};
