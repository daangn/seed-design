import { useMemo } from "@lynx-js/react";

import { useColorMode } from "../contexts/ColorModeContext";
import { useSeedContext } from "../contexts/SeedContext";
import { getSeedClassName, type GetSeedClassNameOptions } from "../utils/get-seed-class-name";

/**
 * Lynx 앱의 root `<page>` 요소에 적용할 SEED Design className을 반환하는 훅이다.
 *
 * `getSeedClassName()`의 reactive 버전이다. `options.colorMode`·`options.colorScheme`을 생략하면
 * `SeedProvider`의 `colorMode`·`preferredColorScheme`을 쓰고, 그 값이 바뀌면 className이 갱신된다.
 *
 * @example
 * ```tsx
 * import { root } from "@lynx-js/react";
 * import { SeedProvider, useSeedClassName } from "@seed-design/lynx-react";
 *
 * function Page() {
 *   const seedClassName = useSeedClassName();
 *   return (
 *     <page className={seedClassName}>
 *       <App />
 *     </page>
 *   );
 * }
 *
 * root.render(
 *   <SeedProvider colorMode="system" preferredColorScheme="dark">
 *     <Page />
 *   </SeedProvider>,
 * );
 * ```
 */
export function useSeedClassName(options?: GetSeedClassNameOptions): string {
  const { preferredColorScheme } = useSeedContext();
  const providedColorMode = useColorMode();
  const colorMode = options?.colorMode ?? providedColorMode;
  const colorScheme = options?.colorScheme ?? preferredColorScheme ?? "light";

  return useMemo(() => getSeedClassName({ colorMode, colorScheme }), [colorMode, colorScheme]);
}
