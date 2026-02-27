"use client";

import { useIcon } from "./icon-context";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

export const IconDetailSvgPreview = () => {
  const { selectedIcon } = useIcon();

  if (!selectedIcon) return null;

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-semibold text-fd-muted-foreground uppercase tracking-wider">
        SVG
      </h4>
      <DynamicCodeBlock lang="xml" code={selectedIcon.svg} />
    </div>
  );
};
