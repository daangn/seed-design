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
    const [platform, ...pathSegments] = name.split("/");
    const examplePath = pathSegments.join("/");
    const Component =
      platform === "react"
        ? React.lazy(() => import(`../examples/react/${examplePath}.tsx`))
        : platform === "breeze"
          ? React.lazy(() => import(`../examples/breeze/${examplePath}.tsx`))
          : undefined;

    if (!Component) {
      return <div>컴포넌트가 존재하지 않습니다.</div>;
    }

    return <Component />;
  }, [name]);

  return (
    <React.Suspense fallback={null}>
      <div
        // The docs `html` uses Pretendard, so the font goes back to what a product using
        // these components would render in. `leading-[normal]` because Tailwind's
        // `leading-normal` is 1.5.
        className={cn(
          "not-prose leading-[normal] w-full flex flex-col justify-center items-center",
          "bg-bg-layer-default font-(family-name:--seed-font-family)",
          isolate && "isolate",
        )}
      >
        {Preview}
      </div>
    </React.Suspense>
  );
}
