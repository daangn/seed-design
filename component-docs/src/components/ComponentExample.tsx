import * as React from "react";
import { Tabs } from "nextra/components";

import ErrorBoundary from "@/src/components/ErrorBoundary";

interface ComponentExampleProps {
  name: string;
}

export function ComponentExample(props: ComponentExampleProps) {
  const { name } = props;

  const Preview = React.useMemo(() => {
    const Component = React.lazy(() => import(`@/snippets/example/react/${name}.tsx`));

    if (!Component) {
      return <div>컴포넌트가 존재하지 않습니다.</div>;
    }

    return <Component />;
  }, [name]);

  const Code = React.useMemo(() => {
    const MDX = React.lazy(() => import(`@/public/mdx/react/${name}.mdx`));

    if (!MDX) {
      return <div>MDX 파일이 존재하지 않습니다.</div>;
    }

    return <MDX />;
  }, [name]);

  return (
    <ErrorBoundary>
      <Tabs items={["미리보기", "코드"]}>
        <Tabs.Tab>
          <React.Suspense fallback={null}>
            <div
              style={{
                minHeight: "300px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
              }}
            >
              {Preview}
            </div>
          </React.Suspense>
        </Tabs.Tab>
        <Tabs.Tab>
          <React.Suspense fallback={null}>{Code}</React.Suspense>
        </Tabs.Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
