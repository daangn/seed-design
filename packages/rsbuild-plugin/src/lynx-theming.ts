import type { ColorMode } from "@seed-design/css/theming";

/**
 * Determine the theme class name for a Lynx `<page>` element.
 *
 * Uses `seed-user-color-scheme-*` to represent the resolved theme on root,
 * while `seed-color-mode-*-only` is reserved for child-level theme overrides.
 *
 * @param colorMode - Plugin color mode option ("system" | "light-only" | "dark-only")
 * @param systemTheme - Value of `lynx.__globalProps.theme` ("Light" | "Dark")
 * @returns "seed-user-color-scheme-light" or "seed-user-color-scheme-dark"
 */
export function getThemeClassName(colorMode: ColorMode, systemTheme: string | undefined): string {
  if (colorMode === "light-only") return "seed-user-color-scheme-light";
  if (colorMode === "dark-only") return "seed-user-color-scheme-dark";
  // "system" → follow device dark mode setting
  return systemTheme?.toLowerCase() === "dark"
    ? "seed-user-color-scheme-dark"
    : "seed-user-color-scheme-light";
}
