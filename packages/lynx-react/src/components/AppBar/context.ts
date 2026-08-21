import { type AppBarMainVariantProps } from "@seed-design/lynx-css/recipes/app-bar-main";
import * as React from "@lynx-js/react";

export type SharedAppBarVariantProps = Pick<
  AppBarMainVariantProps,
  "theme" | "tone" | "transitionStyle"
>;

export interface AppBarContextValue {
  centeredTitlePaddingX: string;
  safeAreaInsetTop: string;
  sharedVariantProps: SharedAppBarVariantProps;
  setLeftWidth: (width: number) => void;
  setRightWidth: (width: number) => void;
}

const AppBarContext = React.createContext<AppBarContextValue | null>(null);

export const AppBarProvider = AppBarContext.Provider;

export function useAppBarContext(consumer: string): AppBarContextValue {
  const ctx = React.useContext(AppBarContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <AppBarRoot/>.`);
  }
  return ctx;
}
