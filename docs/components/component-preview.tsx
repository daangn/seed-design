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

// lazy 컴포넌트는 예제마다 하나만 만든다. 아래에서 Suspense 없이 그리므로 hydration이 예제 모듈을 기다리는
// 동안 React가 렌더링을 버리고 다시 시작하는데, 그때마다 새로 만들면 매번 로딩 중 상태로 돌아간다.
const lazyExamples = new Map<string, React.LazyExoticComponent<React.ComponentType>>();

function getExample(platform: string, examplePath: string) {
  const key = `../examples/${platform}/${examplePath}.tsx`;
  const load = platform === "react" || platform === "breeze" ? examples[key] : undefined;
  if (!load) return undefined;

  let Example = lazyExamples.get(key);
  if (!Example) {
    Example = React.lazy(load);
    lazyExamples.set(key, Example);
  }
  return Example;
}

export function ComponentPreview(props: ComponentPreviewProps) {
  const { name, isolate, safeAreaInsets } = props;

  const [platform, ...pathSegments] = name.split("/");
  const Example = getExample(platform, pathSegments.join("/"));

  // 이 주위에 Suspense를 두지 않는다. 서버가 그린 미리보기를 hydrate하는 중에 예제 모듈을 기다리면
  // boundary가 dehydrated 상태로 남는데, 그 사이 위쪽 context가 바뀌면(탭이 mount 직후 `data-ssr`을
  // 떼는 갱신) React가 boundary를 클라이언트 렌더링으로 돌려 fallback을 그린다. 그러면 이미 보이던
  // 미리보기가 사라졌다가 다시 나타난다. boundary가 없으면 island 전체가 서버 HTML을 유지한 채 모듈을
  // 기다렸다가 한 번에 hydrate된다.
  return (
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
      {!Example ? (
        <div>컴포넌트가 존재하지 않습니다.</div>
      ) : platform === "breeze" ? (
        // Breeze 예제는 motion 기능을 지연 로드하는 provider 아래에서만 움직인다.
        <MotionProvider>
          <Example />
        </MotionProvider>
      ) : (
        <Example />
      )}
    </div>
  );
}
