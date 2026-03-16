import type { ColorMode } from "@seed-design/css/theming";

/**
 * Determine the theme class name for a Lynx `<page>` element.
 *
 * @param colorMode - Plugin color mode option ("system" | "light-only" | "dark-only")
 * @param systemTheme - Value of `lynx.__globalProps.theme` ("Light" | "Dark")
 * @returns "seed-color-mode-light-only" or "seed-color-mode-dark-only"
 */
export function getThemeClassName(colorMode: ColorMode, systemTheme: string | undefined): string {
  if (colorMode === "light-only") return "seed-color-mode-light-only";
  if (colorMode === "dark-only") return "seed-color-mode-dark-only";
  // "system" → follow device dark mode setting
  return systemTheme?.toLowerCase() === "dark"
    ? "seed-color-mode-dark-only"
    : "seed-color-mode-light-only";
}
