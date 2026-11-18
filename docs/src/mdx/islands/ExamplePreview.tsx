/**
 * React 예제 미리보기 island(S3). `ComponentExample.astro`만 렌더링한다(`client:visible`, rootMargin 300px).
 *
 * - 예제 모듈은 `example-modules`에서 이름으로 받는다(변형 A/B는 `astro.config.ts`의 `SEED_DOCS_S3_VARIANT`가 고른다).
 * - 이 island 안에는 Suspense boundary도 서버 `React.lazy`도 없다.
 * - 스타일 래퍼는 `components/component-preview.tsx`와 같다.
 * - hydrate commit 뒤 `ComponentExample.astro`가 감싼 `[data-example-gate]`의 `inert`를 지운다(layout effect는 commit
 *   직후, paint 전에 돈다). 그 전에는 미리보기가 입력을 받지 않는다.
 */
import { type CSSProperties, useLayoutEffect, useRef } from "react";
import clsx from "clsx";
import { getSafeAreaPreviewRules } from "../../../components/safe-area-preview";
import { type ExampleName, useExampleComponent } from "./example-modules";

export interface SafeAreaInsets {
  left: number;
  right: number;
}

export interface ExamplePreviewProps {
  name: ExampleName;
  isolate?: boolean;
  safeAreaInsets?: SafeAreaInsets;
}

export function ExamplePreview(props: ExamplePreviewProps) {
  const { name, isolate, safeAreaInsets } = props;
  const Example = useExampleComponent(name);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    ref.current?.closest("[data-example-gate]")?.removeAttribute("inert");
  }, []);

  return (
    <div
      ref={ref}
      style={
        safeAreaInsets
          ? ({
              "--docs-preview-safe-area-left": `${safeAreaInsets.left}px`,
              "--docs-preview-safe-area-right": `${safeAreaInsets.right}px`,
              "--seed-safe-area-left": `${safeAreaInsets.left}px`,
              "--seed-safe-area-right": `${safeAreaInsets.right}px`,
            } as CSSProperties)
          : undefined
      }
      data-example-preview={name}
      className={clsx(
        "not-prose leading-[normal] w-full flex flex-col justify-center items-center",
        "bg-bg-layer-default font-(family-name:--seed-font-family)",
        isolate && "isolate",
      )}
    >
      {safeAreaInsets && <style>{getSafeAreaPreviewRules(safeAreaInsets).join("\n")}</style>}
      <Example />
    </div>
  );
}

// Astro는 태그 없는 컴포넌트를 렌더러마다 `check()`로 시험한다. React 렌더러의 시험 render에서 `use()`가 suspend하면
// 시험이 실패하고, 다음 MDX 렌더러가 이 함수를 React 밖에서 불러 dev에 "Invalid hook call"이 예제 수만큼 찍혔다
// (그 뒤 `.tsx` 확장자로 React를 추측해 출력은 같았다). `__astro_tag_component__`와 같은 표시로 시험을 건너뛴다.
Object.defineProperty(ExamplePreview, Symbol.for("astro:renderer"), { value: "@astrojs/react" });
