import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import * as React from "react";

import { ComponentPreview } from "./component-preview";
import ErrorBoundary from "./error-boundary";

interface ComponentExampleProps {
  name: string;

  children?: React.ReactNode;
}

export function ComponentExample(props: ComponentExampleProps) {
  const { name, children } = props;

  if (!children) {
    return (
      <React.Suspense fallback={null}>
        <ComponentPreview name={name} />
      </React.Suspense>
    );
  }

  return (
    <ErrorBoundary>
      <Tabs items={["미리보기", "코드"]}>
        <Tab value="미리보기">
          <ComponentPreview name={name} />
        </Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
