"use client";

import { useEffect, useLayoutEffect } from "react";

function syncThemeFromParent() {
  if (window.parent === window) return;

  const parentTheme = getComputedStyle(window.parent.document.documentElement).getPropertyValue(
    "color-scheme",
  );
  const theme = parentTheme === "dark" ? "dark" : "light";
  document.documentElement.style.colorScheme = theme;
  document.documentElement.dataset.seedUserColorScheme = theme;
}

export function BlockThemeListener() {
  useLayoutEffect(() => {
    syncThemeFromParent();
  }, []);

  useEffect(() => {
    if (window.parent === window) return;

    const observer = new MutationObserver(() => {
      syncThemeFromParent();
    });

    observer.observe(window.parent.document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
