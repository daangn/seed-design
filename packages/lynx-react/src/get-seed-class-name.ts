// Lynx 런타임 전역 변수 타입 선언
// 실제 런타임에서는 Lynx 엔진이 제공하며, 빌드 시에는 @lynx-js/types가 정의함
declare const lynx: {
  __globalProps?: Record<string, unknown>;
};

declare const SystemInfo: {
  platform?: "Android" | "iOS" | "Harmony" | "windows" | "macOS";
};

type ColorMode = "system" | "light-only" | "dark-only";

/**
 * Lynx 앱의 root `<page>` 요소에 적용할 SEED Design className을 반환한다.
 *
 * 테마(dark/light)와 플랫폼(iOS/Android)을 자동 감지하여
 * 렌더링 전에 올바른 CSS 변수가 적용되도록 한다.
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
export function getSeedClassName(options?: { colorMode?: ColorMode }): string {
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

  // Platform — SystemInfo.platform에서 디바이스 플랫폼 읽기
  const platform = SystemInfo?.platform;
  const platformClass = platform === "iOS" ? "seed-platform-ios" : "seed-platform-android";

  return `${themeClass} ${platformClass}`;
}
