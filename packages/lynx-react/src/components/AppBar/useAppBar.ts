import type { AppBarVariantProps } from "@seed-design/lynx-css/recipes/app-bar";
import type { AppBarMainVariantProps } from "@seed-design/lynx-css/recipes/app-bar-main";
import { topNavigation as topNavigationVars } from "@seed-design/lynx-css/vars/component";
import * as React from "@lynx-js/react";

import { type UseSafeAreaReturn, useSafeArea } from "../../hooks/useSafeArea";
import type { LynxViewProps } from "../../types";
import type { AppBarContextValue, SharedAppBarVariantProps } from "./context";

type LynxSystemInfo = { platform?: string };

declare const SystemInfo: LynxSystemInfo | undefined;

type AppBarTheme = NonNullable<AppBarVariantProps["theme"]>;
type LayoutChangeHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;
type AppBarStyleObject = Record<string, string | number>;

// Mirrors the recipe's `dimension.x4` as a literal: Lynx drops an inline `calc()` that contains `var()`.
const ROOT_PADDING_X = 16;

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

// The left/right areas sit inside the root padding, so the title clears that padding plus the wider area.
function getCenteredTitlePadding(leftWidth: number, rightWidth: number): string {
  return `${ROOT_PADDING_X + Math.max(leftWidth, rightWidth)}px`;
}

function getRootLayoutStyle(safeArea: UseSafeAreaReturn): AppBarStyleObject {
  return {
    height: `calc(${topNavigationVars.base.enabled.root.height} + ${safeArea.safeAreaInsetTop})`,
    paddingTop: safeArea.safeAreaInsetTop,
    paddingLeft: `calc(${ROOT_PADDING_X}px + ${safeArea.safeAreaInsetLeft})`,
    paddingRight: `calc(${ROOT_PADDING_X}px + ${safeArea.safeAreaInsetRight})`,
  };
}

// The title clears the same distance past each side's inset, so it stays centered in the safe area.
export function getMainLayoutStyle(
  theme: AppBarMainVariantProps["theme"],
  safeArea: UseSafeAreaReturn,
  centeredTitlePaddingX: string,
): AppBarStyleObject | undefined {
  if (theme !== "cupertino") return undefined;

  return {
    top: safeArea.safeAreaInsetTop,
    bottom: "0px",
    paddingLeft: `calc(${safeArea.safeAreaInsetLeft} + ${centeredTitlePaddingX})`,
    paddingRight: `calc(${safeArea.safeAreaInsetRight} + ${centeredTitlePaddingX})`,
  };
}

export function useAppBar(variantProps: AppBarVariantProps) {
  const safeArea = useSafeArea();
  const [leftWidth, setLeftWidth] = React.useState(0);
  const [rightWidth, setRightWidth] = React.useState(0);
  const resolvedTheme = variantProps.theme ?? getDefaultAppBarTheme();

  const resolvedVariantProps: AppBarVariantProps = {
    ...variantProps,
    theme: resolvedTheme,
  };
  const centeredTitlePaddingX = getCenteredTitlePadding(leftWidth, rightWidth);
  const rootLayoutStyle = getRootLayoutStyle(safeArea);
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
      safeArea,
      sharedVariantProps,
      setLeftWidth,
      setRightWidth,
    }),
    [centeredTitlePaddingX, safeArea, sharedVariantProps],
  );

  return {
    contextValue,
    resolvedVariantProps,
    rootLayoutStyle,
  };
}
