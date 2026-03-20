"use client";

import * as React from "react";
import { getExampleComponent } from "./example-registry";

interface ComponentPreviewProps {
  name: string;
}

export function ComponentPreview(props: ComponentPreviewProps) {
  const { name } = props;

  const Preview = React.useMemo(() => {
    const factory = getExampleComponent(name);
    if (!factory) {
      return () => <div>컴포넌트가 존재하지 않습니다.</div>;
    }
    return React.lazy(factory);
  }, [name]);

  return (
    <React.Suspense fallback={null}>
      <div
        className="not-prose example-reset w-full flex flex-col justify-center items-center"
        style={{
          backgroundColor: "var(--seed-color-bg-layer-default)",
        }}
      >
        <Preview />
      </div>
    </React.Suspense>
  );
}
