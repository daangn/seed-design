"use client";

import * as React from "react";
import { useIcon } from "./icon-context";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

export const IconDetailSvgPreview = React.forwardRef<HTMLDivElement>(
  function IconDetailSvgPreview(_, ref) {
    const { selectedIcon } = useIcon();

    if (!selectedIcon) return null;

    return (
      <div ref={ref} className="flex flex-col gap-2">
        <h4 className="text-xs font-semibold text-fd-muted-foreground uppercase tracking-wider">
          SVG
        </h4>
        <DynamicCodeBlock lang="xml" code={selectedIcon.svg} />
      </div>
    );
  },
);

IconDetailSvgPreview.displayName = "IconDetailSvgPreview";
