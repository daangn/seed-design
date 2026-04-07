import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import * as React from "react";

import ErrorBoundary from "./error-boundary";

import { StackflowPreview } from "./stackflow-preview";
import { StackflowIframePreview } from "./stackflow-iframe-preview";
import { Box } from "@ride-developer/react";

type StackflowExampleProps = (
  | { names: string[]; path?: never }
  | { names?: never; path: string }
) & {
  children?: React.ReactNode;
};

export function StackflowExample(props: StackflowExampleProps) {
  const { names, path, children } = props;

  return (
    <ErrorBoundary>
      <Tabs items={["미리보기", "코드"]}>
        <Tab value="미리보기">
          {names && <StackflowPreview names={names} />}
          {path && (
            <Box p="x2">
              <StackflowIframePreview path={path} />
            </Box>
          )}
        </Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
