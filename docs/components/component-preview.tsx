"use client";

import { MotionProvider } from "./MotionProvider";
import { getSafeAreaPreviewRules, type PreviewSafeAreaInsets } from "./safe-area-preview";
import * as React from "react";
import { twMerge as cn } from "tailwind-merge";

interface ComponentPreviewProps {
  name: string;
  isolate?: boolean;
  safeAreaInsets?: PreviewSafeAreaInsets;
}

// 예제는 이름으로 고르므로 번들러가 미리 알 수 있게 후보를 glob으로 등록하고, 실제 import는 지연한다.
const examples = import.meta.glob<{ default: React.ComponentType }>([
  "../examples/react/**/*.tsx",
  "../examples/breeze/**/*.tsx",
]);

export function ComponentPreview(props: ComponentPreviewProps) {
  const { name, isolate, safeAreaInsets } = props;

  const Preview = React.useMemo(() => {
    const [platform, ...pathSegments] = name.split("/");
    const examplePath = pathSegments.join("/");
    const load =
      platform === "react" || platform === "breeze"
        ? examples[`../examples/${platform}/${examplePath}.tsx`]
        : undefined;
    const Component = load ? React.lazy(load) : undefined;

    if (!Component) {
      return <div>컴포넌트가 존재하지 않습니다.</div>;
    }

    // Breeze 예제는 motion 기능을 지연 로드하는 provider 아래에서만 움직인다.
    return platform === "breeze" ? (
      <MotionProvider>
        <Component />
      </MotionProvider>
    ) : (
      <Component />
    );
  }, [name]);

  return (
    <React.Suspense fallback={null}>
      <div
        style={
          safeAreaInsets
            ? ({
                "--docs-preview-safe-area-left": `${safeAreaInsets.left}px`,
                "--docs-preview-safe-area-right": `${safeAreaInsets.right}px`,
                "--seed-safe-area-left": `${safeAreaInsets.left}px`,
                "--seed-safe-area-right": `${safeAreaInsets.right}px`,
              } as React.CSSProperties)
            : undefined
        }
        // The docs `html` uses Pretendard, so the font goes back to what a product using
        // these components would render in. `leading-[normal]` because Tailwind's
        // `leading-normal` is 1.5.
        className={cn(
          "not-prose leading-[normal] w-full flex flex-col justify-center items-center",
          "bg-bg-layer-default font-(family-name:--seed-font-family)",
          isolate && "isolate",
        )}
      >
        {safeAreaInsets && <style>{getSafeAreaPreviewRules(safeAreaInsets).join("\n")}</style>}
        {Preview}
      </div>
    </React.Suspense>
  );
}
