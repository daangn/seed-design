import { SeedTab as Tab, SeedTabs as Tabs } from "@/components/tabs/seed-tabs";
import * as React from "react";

import { ComponentPreview } from "./component-preview";
import ErrorBoundary from "./error-boundary";

interface ComponentExampleProps {
  name: string;

  isolate?: boolean;

  children?: React.ReactNode;
}

export function ComponentExample(props: ComponentExampleProps) {
  const { name, isolate, children } = props;

  // Same card as the tabbed form below, minus the tab strip: an example with nothing to
  // show beside the preview still reads as one content block rather than loose page content.
  // Three boxes rather than one: the scroller sits edge to edge so its scrollbar meets the
  // border instead of floating inside the padding, the card clips that scrollbar back to the
  // rounded corners, and the padding rides on a `w-max` box so an overflowing example keeps
  // the same inset on both sides.
  //
  // `w-max` means intrinsic sizing, where a percentage max-width counts for nothing. An
  // example that should narrow with the card has to cap itself in absolute units — `w-full
  // max-w-[375px]`, not `w-[375px] max-w-full`, which would hold its full width and scroll.
  if (!children) {
    return (
      <React.Suspense fallback={null}>
        <div className="my-4 overflow-hidden rounded-r3 border border-solid border-stroke-neutral-muted">
          <div className="overflow-x-auto">
            <div className="flex min-h-80 w-max min-w-full items-center justify-center p-x5">
              <ComponentPreview name={name} isolate={isolate} />
            </div>
          </div>
        </div>
      </React.Suspense>
    );
  }

  return (
    <ErrorBoundary>
      <Tabs card items={["미리보기", "코드"]}>
        <Tab value="미리보기">
          <div className="flex min-h-80 items-center justify-center p-x5">
            <ComponentPreview name={name} isolate={isolate} />
          </div>
        </Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
