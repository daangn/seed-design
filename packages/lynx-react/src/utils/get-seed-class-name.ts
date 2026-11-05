import { readDeprecatedGlobalProp } from "./deprecated-global-props";

export type ColorMode = "system" | "light-only" | "dark-only";

export interface GetSeedClassNameOptions {
  colorMode?: ColorMode;
  /**
   * `colorMode`가 `"system"`일 때 적용할 색상 스킴. 보통 `SeedProvider`에 넘기는
   * `preferredColorScheme`과 같은 값을 넘긴다.
   *
   * 생략하면 deprecated 경로로 `lynx.__globalProps.theme`을 읽고, 그 값도 없으면 `"light"`다.
   */
  colorScheme?: "light" | "dark";
}

/**
 * Lynx 앱의 root `<page>` 요소에 적용할 SEED Design className을 반환한다.
 *
 * `colorMode`가 `"system"`이면 `colorScheme`에 맞는 테마 className을 돌려준다.
 *
 * 호출 시점의 값을 한 번만 읽는 함수다. 런타임 테마 변경에 반응해야 하면
 * `SeedProvider` 값을 구독하는 `useSeedClassName` 훅을 사용한다.
 *
 * @example
 * ```tsx
 * import { getSeedClassName } from "@seed-design/lynx-react";
 *
 * root.render(
 *   <page className={getSeedClassName({ colorMode: "system", colorScheme: "dark" })}>
 *     <App />
 *   </page>
 * );
 * ```
 */
export function getSeedClassName(options?: GetSeedClassNameOptions): string {
  const { colorMode = "system", colorScheme } = options ?? {};

  if (colorMode === "light-only") return "seed-user-color-scheme-light";
  if (colorMode === "dark-only") return "seed-user-color-scheme-dark";

  const systemTheme =
    colorScheme ??
    readDeprecatedGlobalProp(typeof lynx !== "undefined" ? lynx.__globalProps : undefined, "theme");

  return typeof systemTheme === "string" && systemTheme.toLowerCase() === "dark"
    ? "seed-user-color-scheme-dark"
    : "seed-user-color-scheme-light";
}
