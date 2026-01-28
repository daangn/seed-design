"use client";

import { useEffect, useState } from "react";

export type ColorMode = "system" | "light-only" | "dark-only";
export type UserColorScheme = "light" | "dark";

export interface ThemeInfo {
  colorMode: ColorMode;
  userColorScheme: UserColorScheme;
}

function readThemeInfo(): ThemeInfo {
  if (typeof document === "undefined") {
    return {
      colorMode: "system",
      userColorScheme: "light",
    };
  }

  const colorMode = document.documentElement.getAttribute(
    "data-seed-color-mode"
  ) as ColorMode;
  const userColorScheme = document.documentElement.getAttribute(
    "data-seed-user-color-scheme"
  );

  return {
    colorMode: colorMode || "system",
    userColorScheme: userColorScheme === "dark" ? "dark" : "light",
  };
}

export function useTheme(): ThemeInfo {
  const [themeInfo, setThemeInfo] = useState<ThemeInfo>(readThemeInfo);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const observer = new MutationObserver(() => {
      setThemeInfo(readThemeInfo());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-seed-color-mode", "data-seed-user-color-scheme"],
    });

    return () => observer.disconnect();
  }, []);

  return themeInfo;
}
