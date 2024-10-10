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
    const MDX = React.lazy(() => import(`@/public/__mdx__/react/${name}.mdx`));

    if (!MDX) {
      return <div>MDX 파일이 존재하지 않습니다.</div>;
    }

    return <MDX />;
  }, [name]);

  return (
    <ErrorBoundary>
      <React.Suspense fallback={null}>
        <Tabs items={["미리보기", "코드"]}>
          <Tabs.Tab>
            <div
              style={{
                minHeight: "300px",
                width: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.01)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                borderRadius: ".75rem",
              }}
            >
              {Preview}
            </div>
          </Tabs.Tab>
          <Tabs.Tab>
            <React.Suspense fallback={null}>{Code}</React.Suspense>
          </Tabs.Tab>
        </Tabs>
      </React.Suspense>
    </ErrorBoundary>
  );
}
