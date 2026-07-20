"use client";

import * as React from "react";
import { twMerge as cn } from "tailwind-merge";

interface ComponentPreviewProps {
  name: string;
  isolate?: boolean;
}

// Reset examples back to the system font (the docs `html` uses Pretendard) so SEED
// component demos render in their native platform typeface. A comma-separated font
// stack doesn't fit a Tailwind arbitrary class cleanly, so it lives in `style`;
// `leading-[normal]` handles the line-height (Tailwind's `leading-normal` is 1.5).
const SYSTEM_FONT_STACK =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';

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
          "not-prose leading-[normal] w-full flex flex-col justify-center items-center",
          isolate && "isolate",
        )}
        style={{
          backgroundColor: "var(--seed-color-bg-layer-default)",
          fontFamily: SYSTEM_FONT_STACK,
        }}
      >
        {Preview}
      </div>
    </React.Suspense>
  );
}
