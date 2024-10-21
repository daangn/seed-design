import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import * as React from "react";
import * as Index from "./example/index.json";

import ErrorBoundary from "./error-boundary";
import { CodeBlock } from "./code-block";

import { Stackflow } from "./stackflow/Stackflow";
import type { ActivityComponentType } from "@stackflow/react/future";

interface StackflowExampleProps {
  name: string;
}

export function StackflowExample(props: StackflowExampleProps) {
  const { name } = props;

  const Activity = React.useMemo(() => {
    const Component = React.lazy(() => import(`./example/${name}.tsx`));

    if (!Component) {
      return <div>컴포넌트가 존재하지 않습니다.</div>;
    }

    return Component;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  }, [name]) as unknown as ActivityComponentType<any>;

  const Code = React.useMemo(() => {
    return (Index as Record<string, string>)[name];
  }, [name]);

  return (
    <ErrorBoundary>
      <React.Suspense fallback={null}>
        <Tabs items={["미리보기", "코드"]}>
          <Tab value="미리보기">
            <Stackflow Activity={Activity} />
          </Tab>
          <Tab value="코드">
            <CodeBlock lang="tsx" wrapper={{ allowCopy: true }} code={Code} />
          </Tab>
        </Tabs>
      </React.Suspense>
    </ErrorBoundary>
  );
}
