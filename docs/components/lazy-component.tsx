import { type ComponentType, lazy, Suspense, useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * 컴포넌트를 별도 청크로 지연 로드한다. `ssr: false`면 서버 HTML에는 넣지 않고 hydration 뒤에만
 * 렌더링한다(브라우저 API가 있어야 import할 수 있는 모듈용).
 */
export function lazyComponent<Props extends object>(
  load: () => Promise<ComponentType<Props>>,
  { ssr = true }: { ssr?: boolean } = {},
) {
  const Lazy = lazy(async () => ({ default: await load() }));

  return function LazyComponent(props: Props) {
    const hydrated = useSyncExternalStore(
      subscribe,
      () => true,
      () => false,
    );
    if (!ssr && !hydrated) return null;

    return (
      <Suspense fallback={null}>
        <Lazy {...props} />
      </Suspense>
    );
  };
}
