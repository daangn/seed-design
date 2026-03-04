"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense, useEffect, useState } from "react";

import * as MonochormeComponents from "@karrotmarket/react-monochrome-icon";
import * as MulticolorComponents from "@karrotmarket/react-multicolor-icon";

import MonochromeData from "@karrotmarket/icon-data/monochrome.json";
import MulticolorData from "@karrotmarket/icon-data/multicolor.json";

import { SnackbarProvider } from "seed-design/ui/snackbar";
import { BottomSheetBody, BottomSheetContent, BottomSheetRoot } from "seed-design/ui/bottom-sheet";

import { IconProvider, useIcon } from "./icon-context";
import { IconDetailPanel } from "./icon-detail-panel";
import { IconGrid } from "./icon-grid";
import { IconSearch } from "./icon-search";
import { IconSegmentedControl } from "./icon-segmented-control";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

const IconLibraryContent = () => {
  const { selectedIcon, setSelectedIconName } = useIcon();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <IconSegmentedControl />
          <div className="pb-10 pt-4">
            <IconSearch />
          </div>
          <IconGrid />
        </div>

        {!isMobile && selectedIcon && (
          <div className="w-[420px] shrink-0 border border-fd-border rounded-lg bg-fd-background p-5 self-start sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <IconDetailPanel />
          </div>
        )}
      </div>

      <BottomSheetRoot
        open={isMobile && !!selectedIcon}
        onOpenChange={(open) => {
          if (!open) setSelectedIconName("");
        }}
      >
        <BottomSheetContent
          title={selectedIcon?.name ?? ""}
          showCloseButton
          showHandle
          style={{ overflow: "hidden" }}
        >
          <BottomSheetBody>
            <IconDetailPanel />
          </BottomSheetBody>
        </BottomSheetContent>
      </BottomSheetRoot>
    </>
  );
};

export const IconLibrary = () => {
  return (
    <NuqsAdapter>
      <Suspense>
        <SnackbarProvider>
          <IconProvider
            iconData={{ monochrome: MonochromeData, multicolor: MulticolorData }}
            iconComponents={{
              monochrome: MonochormeComponents,
              multicolor: MulticolorComponents,
            }}
          >
            <IconLibraryContent />
          </IconProvider>
        </SnackbarProvider>
      </Suspense>
    </NuqsAdapter>
  );
};
