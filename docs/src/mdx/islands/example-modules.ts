/**
 * React·Breeze 예제 이름 → 모듈. 서버(prerender)와 브라우저(hydrate)가 같은 이름 규칙·같은 목록을 쓴다.
 * 목록은 `import.meta.glob` 하나에서 파생한다(손 목록 없음). `ExamplePreview.tsx`와 `ComponentExample.astro`만 import한다.
 *
 * 변형 A(S3): lazy glob 하나 + 모듈 수준 promise cache + React 19 `use()`. 서버·브라우저 분기가 없다.
 * - 서버: boundary가 없으니 Fizz가 shell 안의 suspend를 기다려 완성 HTML을 낸다(`$RC`·`<template>` 없음).
 *   suspend는 renderer 안, `useId` 접두사를 받은 뒤에 일어나고 `.astro`에는 await가 없다.
 * - 브라우저: island chunk에 glob map만 있고 예제는 파일마다 chunk다. hydrate 중 루트가 suspend하는 동안 서버 HTML이
 *   그대로 남는다.
 * 빌드 결정성(같은 tree `--force` 2회 바이트 동일)은 PLAN Phase 3 첫 실험이 판정한다. 실패하면 변형 B2(서버 eager glob을
 * environment별 virtual module로)로 바꾼다.
 */
import { type ComponentType, use } from "react";

export type ExampleName = `react/${string}` | `breeze/${string}`;
type ExampleModule = { default: ComponentType };

const LOADERS: Record<string, () => Promise<ExampleModule>> = Object.fromEntries(
  Object.entries(
    import.meta.glob<ExampleModule>(["/examples/react/**/*.tsx", "/examples/breeze/**/*.tsx"]),
  ).map(([path, load]) => [path.slice("/examples/".length, -".tsx".length), load]),
);

// 같은 promise 객체를 다시 넘겨야 React가 붙인 상태(`status`·`value`)로 두 번째 render부터 동기로 돌려준다.
const cache = new Map<string, Promise<ExampleModule>>();

/** 빌드 시점 검증용. `ComponentExample.astro`가 없는 이름을 빌드 오류로 막는다. */
export function hasExample(name: string): name is ExampleName {
  return name in LOADERS;
}

/** island 루트 렌더 중에만 부른다(훅 규칙). */
export function useExampleComponent(name: ExampleName): ComponentType {
  let promise = cache.get(name);
  if (!promise) {
    const loader = LOADERS[name];
    if (!loader) throw new Error(`examples/${name}.tsx가 없습니다.`);
    promise = loader();
    cache.set(name, promise);
  }
  return use(promise).default;
}
