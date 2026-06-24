"use client";

import * as React from "react";
import { twMerge as cn } from "tailwind-merge";

interface ComponentPreviewProps {
  name: string;
  isolate?: boolean;
}

export function ComponentPreview(props: ComponentPreviewProps) {
  const { name, isolate } = props;

  const Preview = React.useMemo(() => {
    const Component = React.lazy(() => import(`../examples/${name}.tsx`));

    if (!Component) {
      return <div>컴포넌트가 존재하지 않습니다.</div>;
    }

    return <Component />;
  }, [name]);

  return (
    <React.Suspense fallback={null}>
      <div
        className={cn(
          "not-prose example-reset w-full flex flex-col justify-center items-center",
          isolate && "isolate",
        )}
        style={{
          backgroundColor: "var(--seed-color-bg-layer-default)",
        }}
      >
        {Preview}
      </div>
    </React.Suspense>
  );
}
