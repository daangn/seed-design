import { type ColorMode, ThemeContext, useThemeBehavior } from "@seed-design/react-theming";
import type * as React from "react";

export type Options = {
  mode: ColorMode;
};

export const Wrapper: React.FC<React.PropsWithChildren<Options>> = ({ mode, children }) => {
  const theme = useThemeBehavior({ mode });
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
