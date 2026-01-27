import { useEffect, useState } from "react";

export type ColorMode = "system" | "light-only" | "dark-only";
export type UserColorScheme = "light" | "dark";

export interface ThemeInfo {
  colorMode: ColorMode;
  userColorScheme: UserColorScheme;
}

export function useTheme(): ThemeInfo {
  const [themeInfo, setThemeInfo] = useState<ThemeInfo>(() => {
    const colorMode = document.documentElement.getAttribute("data-seed-color-mode") as ColorMode;
    const userColorScheme = document.documentElement.getAttribute("data-seed-user-color-scheme");

    return {
      colorMode: colorMode || "system",
      userColorScheme: userColorScheme === "dark" ? "dark" : "light",
    };
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const colorMode = document.documentElement.getAttribute("data-seed-color-mode") as ColorMode;
      const userColorScheme = document.documentElement.getAttribute("data-seed-user-color-scheme");

      setThemeInfo({
        colorMode: colorMode || "system",
        userColorScheme: userColorScheme === "dark" ? "dark" : "light",
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-seed-color-mode", "data-seed-user-color-scheme"],
    });

    return () => observer.disconnect();
  }, []);

  return themeInfo;
}
