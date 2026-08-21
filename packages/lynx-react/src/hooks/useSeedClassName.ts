import { useGlobalProps, useMemo } from "@lynx-js/react";

import { getSeedClassName, type GetSeedClassNameOptions } from "../utils/get-seed-class-name";

/**
 * Lynx 앱의 root `<page>` 요소에 적용할 SEED Design className을 반환하는 훅이다.
 *
 * `getSeedClassName()`의 reactive 버전으로, `useGlobalProps()`를 통해
 * `lynx.__globalProps.theme` 변경을 구독한다. host가 테마를 변경하면 이 훅을
 * 사용하는 컴포넌트가 리렌더되어 className이 갱신된다.
 *
 * @example
 * ```tsx
 * import { root } from "@lynx-js/react";
 * import { useSeedClassName } from "@seed-design/lynx-react";
 *
 * function Root() {
 *   const seedClassName = useSeedClassName({ colorMode: "system" });
 *   return (
 *     <page className={seedClassName}>
 *       <App />
 *     </page>
 *   );
 * }
 *
 * root.render(<Root />);
 * ```
 */
export function useSeedClassName(options?: GetSeedClassNameOptions): string {
  // useGlobalProps()로 lynx.__globalProps를 구독한다.
  // host가 theme을 변경하면 이 훅을 사용하는 컴포넌트가 리렌더되어 className이 갱신된다.
  const globalProps = useGlobalProps() as { theme?: unknown };

  return useMemo(() => getSeedClassName(options), [globalProps.theme, options?.colorMode]);
}
