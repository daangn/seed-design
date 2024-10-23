import * as React from "react";

export const useThemeSync = () => {
  React.useLayoutEffect(() => {
    const theme = document.documentElement.style.getPropertyValue("color-scheme");
    if (theme === "dark") {
      document.documentElement.dataset.seedScaleColor = "dark";
    } else {
      document.documentElement.dataset.seedScaleColor = "light";
    }
  }, []);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.style.getPropertyValue("color-scheme");
      if (theme === "dark") {
        document.documentElement.dataset.seedScaleColor = "dark";
      } else {
        document.documentElement.dataset.seedScaleColor = "light";
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }, []);
};
