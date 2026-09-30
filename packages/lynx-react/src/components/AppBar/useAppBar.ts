import type { AppBarVariantProps } from "@seed-design/lynx-css/recipes/app-bar";
import type { AppBarMainVariantProps } from "@seed-design/lynx-css/recipes/app-bar-main";
import * as React from "@lynx-js/react";

import { useSafeArea } from "../../hooks/useSafeArea";
import type { LynxViewProps } from "../../types";
import type { AppBarContextValue, SharedAppBarVariantProps } from "./context";

type LynxSystemInfo = { platform?: string };

declare const SystemInfo: LynxSystemInfo | undefined;

type AppBarTheme = NonNullable<AppBarVariantProps["theme"]>;
type LayoutChangeHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;
type AppBarStyleObject = Record<string, string | number>;

const APP_BAR_HEIGHT_BY_THEME: Record<AppBarTheme, string> = {
  cupertino: "44px",
  android: "56px",
};

function getDefaultAppBarTheme(): AppBarTheme {
  const globalSystemInfo = (globalThis as typeof globalThis & { SystemInfo?: LynxSystemInfo })
    .SystemInfo;
  const systemInfo =
    globalSystemInfo ?? (typeof SystemInfo === "undefined" ? undefined : SystemInfo);

  if (systemInfo == null) return "cupertino";

  return systemInfo.platform === "Android" ? "android" : "cupertino";
}

export function getLayoutWidth(event: Parameters<LayoutChangeHandler>[0]): number | null {
  const eventWithWidth = event as Parameters<LayoutChangeHandler>[0] & { width?: number };
  const nextWidth = event.detail?.width ?? event.params?.width ?? eventWithWidth.width;
  if (typeof nextWidth !== "number" || !Number.isFinite(nextWidth)) return null;

  return Math.max(0, nextWidth);
}

function getCenteredTitlePadding(leftWidth: number, rightWidth: number): string {
  return `${Math.max(leftWidth, rightWidth)}px`;
}

function getRootLayoutStyle(theme: AppBarTheme, safeAreaInsetTop: string): AppBarStyleObject {
  return {
    height: `calc(${APP_BAR_HEIGHT_BY_THEME[theme]} + ${safeAreaInsetTop})`,
    paddingTop: safeAreaInsetTop,
  };
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

export function useAppBar(variantProps: AppBarVariantProps) {
  const { safeAreaInsetTop } = useSafeArea();
  const [leftWidth, setLeftWidth] = React.useState(0);
  const [rightWidth, setRightWidth] = React.useState(0);
  const resolvedTheme = variantProps.theme ?? getDefaultAppBarTheme();

  const resolvedVariantProps: AppBarVariantProps = {
    ...variantProps,
    theme: resolvedTheme,
  };
  const centeredTitlePaddingX = getCenteredTitlePadding(leftWidth, rightWidth);
  const rootLayoutStyle = getRootLayoutStyle(resolvedTheme, safeAreaInsetTop);
  const sharedVariantProps = React.useMemo<SharedAppBarVariantProps>(
    () => ({
      theme: resolvedVariantProps.theme,
      tone: resolvedVariantProps.tone,
      transitionStyle: resolvedVariantProps.transitionStyle,
    }),
    [resolvedVariantProps.theme, resolvedVariantProps.tone, resolvedVariantProps.transitionStyle],
  );
  const contextValue = React.useMemo<AppBarContextValue>(
    () => ({
      centeredTitlePaddingX,
      safeAreaInsetTop,
      sharedVariantProps,
      setLeftWidth,
      setRightWidth,
    }),
    [centeredTitlePaddingX, safeAreaInsetTop, sharedVariantProps],
  );

  return {
    contextValue,
    resolvedVariantProps,
    rootLayoutStyle,
  };
}
