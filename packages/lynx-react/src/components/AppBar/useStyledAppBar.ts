import type { AppBarVariantProps } from "@seed-design/lynx-css/recipes/app-bar";
import type { AppBarMainVariantProps } from "@seed-design/lynx-css/recipes/app-bar-main";
import { topNavigation as topNavigationVars } from "@seed-design/lynx-css/vars/component";
import * as React from "@lynx-js/react";
import { useAppBar, useAppBarContext, type UseAppBarReturn } from "@seed-design/lynx-react-app-bar";

type LynxSystemInfo = { platform?: string };

declare const SystemInfo: LynxSystemInfo | undefined;

type AppBarTheme = NonNullable<AppBarVariantProps["theme"]>;
type AppBarStyleObject = Record<string, string | number>;

// Mirrors the recipe's `dimension.x4` as a literal: Lynx drops an inline `calc()` that contains `var()`.
const ROOT_PADDING_X = 16;

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

// The left/right areas sit inside the root padding, so the title clears each side's inset, that padding,
// and the wider area. Clearing the same distance on both sides keeps it centered in the safe area.
export function getMainLayoutStyle(
  theme: AppBarMainVariantProps["theme"],
  api: UseAppBarReturn,
): AppBarStyleObject | undefined {
  if (theme !== "cupertino") return undefined;

  return {
    top: api.safeAreaInsetTop,
    bottom: "0px",
    paddingLeft: `calc(${api.safeAreaInsetLeft} + ${ROOT_PADDING_X}px + ${api.centeredTitlePaddingX})`,
    paddingRight: `calc(${api.safeAreaInsetRight} + ${ROOT_PADDING_X}px + ${api.centeredTitlePaddingX})`,
  };
}

/** Headless AppBar 상태에 platform 기본 theme과 theme별 root 배치를 더한다. */
export function useStyledAppBar(variantProps: AppBarVariantProps) {
  const api = useAppBar();
  const theme = variantProps.theme ?? getDefaultAppBarTheme();
  const resolvedVariantProps: AppBarVariantProps = { ...variantProps, theme };
  const rootLayoutStyle: AppBarStyleObject = {
    height: `calc(${topNavigationVars.base.enabled.root.height} + ${api.safeAreaInsetTop})`,
    paddingTop: api.safeAreaInsetTop,
    paddingLeft: `calc(${ROOT_PADDING_X}px + ${api.safeAreaInsetLeft})`,
    paddingRight: `calc(${ROOT_PADDING_X}px + ${api.safeAreaInsetRight})`,
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
