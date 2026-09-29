import type { AppBarVariantProps } from "@seed-design/lynx-css/recipes/app-bar";
import type { AppBarMainVariantProps } from "@seed-design/lynx-css/recipes/app-bar-main";
import * as React from "@lynx-js/react";
import { useAppBar, useAppBarContext, type UseAppBarReturn } from "@seed-design/lynx-react-app-bar";

type LynxSystemInfo = { platform?: string };

declare const SystemInfo: LynxSystemInfo | undefined;

type AppBarTheme = NonNullable<AppBarVariantProps["theme"]>;
type AppBarStyleObject = Record<string, string | number>;

const APP_BAR_HEIGHT_BY_THEME: Record<AppBarTheme, string> = {
  cupertino: "44px",
  android: "56px",
};

export type SharedAppBarVariantProps = Pick<
  AppBarMainVariantProps,
  "theme" | "tone" | "transitionStyle"
>;

export interface StyledAppBarContextValue extends UseAppBarReturn {
  sharedVariantProps: SharedAppBarVariantProps;
}

function getDefaultAppBarTheme(): AppBarTheme {
  const globalSystemInfo = (globalThis as typeof globalThis & { SystemInfo?: LynxSystemInfo })
    .SystemInfo;
  const systemInfo =
    globalSystemInfo ?? (typeof SystemInfo === "undefined" ? undefined : SystemInfo);

  if (systemInfo == null) return "cupertino";

  return systemInfo.platform === "Android" ? "android" : "cupertino";
}

export function getMainLayoutStyle(
  theme: AppBarMainVariantProps["theme"],
  safeAreaInsetTop: string,
): AppBarStyleObject | undefined {
  if (theme !== "cupertino") return undefined;

  return {
    top: safeAreaInsetTop,
    bottom: "0px",
  };
}

/** Headless AppBar 상태에 platform 기본 theme과 theme별 root 배치를 더한다. */
export function useStyledAppBar(variantProps: AppBarVariantProps) {
  const api = useAppBar();
  const theme = variantProps.theme ?? getDefaultAppBarTheme();
  const resolvedVariantProps: AppBarVariantProps = { ...variantProps, theme };
  const rootLayoutStyle: AppBarStyleObject = {
    height: `calc(${APP_BAR_HEIGHT_BY_THEME[theme]} + ${api.safeAreaInsetTop})`,
    paddingTop: api.safeAreaInsetTop,
  };
  const sharedVariantProps = React.useMemo<SharedAppBarVariantProps>(
    () => ({
      theme,
      tone: variantProps.tone,
      transitionStyle: variantProps.transitionStyle,
    }),
    [theme, variantProps.tone, variantProps.transitionStyle],
  );
  const contextValue = React.useMemo<StyledAppBarContextValue>(
    () => ({ ...api, sharedVariantProps }),
    [api, sharedVariantProps],
  );

  return {
    contextValue,
    resolvedVariantProps,
    rootLayoutStyle,
  };
}

export function useStyledAppBarContext(consumer: string): StyledAppBarContextValue {
  const context = useAppBarContext();
  if (!("sharedVariantProps" in context)) {
    throw new Error(`<${consumer}/> must be rendered inside a styled <AppBarRoot/>.`);
  }
  return context as StyledAppBarContextValue;
}
