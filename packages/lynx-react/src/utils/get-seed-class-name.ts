// Lynx 런타임 전역 변수 타입 선언
// 실제 런타임에서는 Lynx 엔진이 제공하며, 빌드 시에는 @lynx-js/types가 정의함
declare const lynx: {
  __globalProps?: Record<string, unknown>;
};

export type ColorMode = "system" | "light-only" | "dark-only";

export interface GetSeedClassNameOptions {
  colorMode?: ColorMode;
}

/**
 * Lynx 앱의 root `<page>` 요소에 적용할 SEED Design className을 반환한다.
 *
 * 테마(dark/light)를 자동 감지하여 렌더링 전에 올바른 CSS 변수가 적용되도록 한다.
 *
 * 호출 시점의 테마를 한 번만 읽는 순수 함수다. 런타임 테마 변경에 반응해야 하면
 * reactive 버전인 `useSeedClassName` 훅을 사용한다.
 *
 * @example
 * ```tsx
 * import { getSeedClassName } from "@seed-design/lynx-react";
 *
 * root.render(
 *   <page className={getSeedClassName({ colorMode: "system" })}>
 *     <App />
 *   </page>
 * );
 * ```
 */
export function getSeedClassName(options?: GetSeedClassNameOptions): string {
  const { colorMode = "system" } = options ?? {};

  // Theme — lynx.__globalProps.theme에서 시스템 테마 읽기
  const systemTheme = lynx?.__globalProps?.["theme"] as string | undefined;
  let themeClass: string;
  if (colorMode === "light-only") {
    themeClass = "seed-user-color-scheme-light";
  } else if (colorMode === "dark-only") {
    themeClass = "seed-user-color-scheme-dark";
  } else {
    themeClass =
      systemTheme?.toLowerCase() === "dark"
        ? "seed-user-color-scheme-dark"
        : "seed-user-color-scheme-light";
  }

  return themeClass;
}
