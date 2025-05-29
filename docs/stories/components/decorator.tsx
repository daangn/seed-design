import type { Decorator } from "@storybook/nextjs";
import { useEffect } from "react";

import { FONT_SCALE_MAP, type FontScales } from "@/stories/utils/parameters";

export const SeedThemeDecorator: Decorator = (Story, ctx) => {
  useEffect(() => {
    const { theme, fontScale } = ctx.parameters;
    const isDarkTheme = theme === "dark";

    // theme

    document.documentElement.setAttribute(
      "data-seed-color-mode",
      isDarkTheme ? "dark-only" : "light-only",
    );
    document.documentElement.setAttribute(
      "data-seed-user-color-scheme",
      isDarkTheme ? "dark" : "light",
    );

    // font scale

    document.documentElement.style.removeProperty("--base-font-size");

    if (typeof fontScale === "string" && fontScale in FONT_SCALE_MAP) {
      document.documentElement.style.setProperty(
        "--base-font-size",
        FONT_SCALE_MAP[fontScale as FontScales],
      );
    }
  }, [ctx.parameters]);

  return <Story />;
};
