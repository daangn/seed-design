import type { ColorMode } from "@seed-design/css/theming";

/**
 * Determine the theme class name for a Lynx `<page>` element.
 *
 * @param colorMode - Plugin color mode option ("system" | "light-only" | "dark-only")
 * @param systemTheme - Value of `lynx.__globalProps.theme` ("Light" | "Dark")
 * @returns "seed-theme-light" or "seed-theme-dark"
 */
export function getThemeClassName(colorMode: ColorMode, systemTheme: string | undefined): string {
  if (colorMode === "light-only") return "seed-theme-light";
  if (colorMode === "dark-only") return "seed-theme-dark";
  // "system" → follow device dark mode setting
  return systemTheme?.toLowerCase() === "dark" ? "seed-theme-dark" : "seed-theme-light";
}
