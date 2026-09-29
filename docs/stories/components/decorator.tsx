import type { Decorator } from "@storybook/nextjs-vite";
import { type ReactNode, useLayoutEffect, useState } from "react";

import { FONT_SCALE_MAP, type FontScales } from "@/stories/utils/parameters";

export function SeedThemeBoundary({
  children,
  theme,
  fontScale,
}: {
  children: ReactNode;
  theme?: string;
  fontScale?: string;
}) {
  const key = JSON.stringify([theme, fontScale]);
  const [appliedKey, setAppliedKey] = useState<string>();
  useLayoutEffect(() => {
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
    setAppliedKey(key);
  }, [theme, fontScale, key]);

  // 자식의 최초 크기 측정과 포커스 이동 전에 테마와 폰트 배율을 적용한다.
  return appliedKey === key ? children : null;
}

export const SeedThemeDecorator: Decorator = (Story, ctx) => (
  <SeedThemeBoundary theme={ctx.parameters.theme} fontScale={ctx.parameters.fontScale}>
    <Story />
  </SeedThemeBoundary>
);
