import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import * as React from "react";

import ErrorBoundary from "./error-boundary";

import { StackflowPreview } from "./stackflow-preview";

interface StackflowExampleProps {
  names: string[];

  children?: React.ReactNode;
}

export function StackflowExample(props: StackflowExampleProps) {
  const { names, children } = props;

  return (
    <ErrorBoundary>
      <Tabs items={["미리보기", "코드"]}>
        <Tab value="미리보기">
          <StackflowPreview names={names} />
        </Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
