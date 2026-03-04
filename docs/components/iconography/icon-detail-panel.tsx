"use client";

import * as React from "react";
import { useIcon } from "./icon-context";
import { IconDetailHeader } from "./icon-detail-header";
import { IconDetailPlatformTabs } from "./icon-detail-platform-tabs";
import { IconDetailSvgPreview } from "./icon-detail-svg-preview";

export const IconDetailPanel = React.forwardRef<HTMLDivElement>(function IconDetailPanel(_, ref) {
  const { setSelectedIconName } = useIcon();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIconName("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedIconName]);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto overflow-x-hidden min-w-0"
    >
      <IconDetailHeader />
      <IconDetailPlatformTabs />
      <IconDetailSvgPreview />
    </div>
  );
});

IconDetailPanel.displayName = "IconDetailPanel";
