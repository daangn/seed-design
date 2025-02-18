"use client";

import * as React from "react";
import ErrorBoundary from "./error-boundary";

interface ComponentPreviewProps {
  name: string;
}

export function ComponentPreview(props: ComponentPreviewProps) {
  const { name } = props;

  const Preview = React.useMemo(() => {
    const Component = React.lazy(() => import(`./example/${name}.tsx`));

    if (!Component) {
      return <div>컴포넌트가 존재하지 않습니다.</div>;
    }

    return <Component />;
  }, [name]);

  return (
    <ErrorBoundary>
      <div
        className="not-prose example-reset"
        style={{
          minHeight: "300px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--seed-color-bg-layer-default)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <React.Suspense fallback={null}>
          <div className="example-enter">{Preview}</div>
        </React.Suspense>
      </div>
    </ErrorBoundary>
  );
}
