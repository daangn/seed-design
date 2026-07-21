"use client";

import * as React from "react";
import { useIcon } from "./icon-context";
import { SeedClientCodeBlock } from "@/components/codeblock/client-code-block";

export const IconDetailSvgPreview = React.forwardRef<HTMLDivElement>(
  function IconDetailSvgPreview(_, ref) {
    const { selectedIcon } = useIcon();

    if (!selectedIcon) return null;

    return (
      <div ref={ref} className="flex flex-col gap-2">
        <h4 className="text-xs font-semibold text-fd-muted-foreground uppercase tracking-wider">
          SVG
        </h4>
        <SeedClientCodeBlock lang="xml" code={selectedIcon.svg} className="!my-0" />
      </div>
    );
  },
);

IconDetailSvgPreview.displayName = "IconDetailSvgPreview";
