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
        <div className="flex min-h-80">
          <ComponentPreview name={name} />
        </div>
      </React.Suspense>
    );
  }

  return (
    <ErrorBoundary>
      <Tabs items={["미리보기", "코드"]}>
        <Tab value="미리보기">
          <div className="flex min-h-80">
            <ComponentPreview name={name} />
          </div>
        </Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
