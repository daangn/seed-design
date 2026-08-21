import { SeedTab as Tab, SeedTabs as Tabs } from "@/components/tabs/seed-tabs";
import type * as React from "react";

import ErrorBoundary from "./error-boundary";

import { StackflowIframePreview } from "./stackflow-iframe-preview";
import { Box } from "@seed-design/react";

interface StackflowExampleProps {
  /**
   * Path into the stackflow-spa app to load inside the isolated iframe preview.
   *
   * Inline previews are intentionally not supported: rendering a stackflow
   * activity inline (e.g. an `defaultOpen` modal) mutates the shared
   * `document.body` — scroll lock, focus trap — and freezes the surrounding
   * docs page. The iframe scopes those global effects to its own document.
   */
  path: string;
  children?: React.ReactNode;
}

export function StackflowExample({ path, children }: StackflowExampleProps) {
  return (
    <ErrorBoundary>
      <Tabs card items={["미리보기", "코드"]}>
        <Tab value="미리보기">
          <Box p="x5">
            <StackflowIframePreview path={path} />
          </Box>
        </Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
