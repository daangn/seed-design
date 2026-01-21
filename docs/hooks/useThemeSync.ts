import * as React from "react";

export const useThemeSync = () => {
  React.useLayoutEffect(() => {
    const theme = document.documentElement.style.getPropertyValue("color-scheme");
    if (theme === "dark") {
      document.documentElement.dataset.seedUserColorScheme = "dark";
    } else {
      document.documentElement.dataset.seedUserColorScheme = "light";
    }
  }, []);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.style.getPropertyValue("color-scheme");
      if (theme === "dark") {
        document.documentElement.dataset.seedUserColorScheme = "dark";
      } else {
        document.documentElement.dataset.seedUserColorScheme = "light";
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);
};
