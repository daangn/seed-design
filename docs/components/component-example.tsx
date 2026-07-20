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

  if (!children) {
    return (
      <React.Suspense fallback={null}>
        <div className="flex min-h-80">
          <ComponentPreview name={name} isolate={isolate} />
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
