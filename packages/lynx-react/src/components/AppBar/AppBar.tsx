import { appBar, type AppBarVariantProps } from "@seed-design/lynx-css/recipes/app-bar";
import {
  appBarMain,
  type AppBarMainVariantProps,
} from "@seed-design/lynx-css/recipes/app-bar-main";
import * as React from "@lynx-js/react";
import clsx from "clsx";

import { useSafeArea } from "../../hooks/useSafeArea";
import type {
  LynxElementProps,
  LynxIconElementProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { Icon } from "../Icon";

type LynxSystemInfo = { platform?: string };

declare const SystemInfo: LynxSystemInfo | undefined;

type AppBarClassNames = ReturnType<typeof appBar>;
type AppBarMainClassNames = ReturnType<typeof appBarMain>;
type AppBarTheme = NonNullable<AppBarVariantProps["theme"]>;
type SharedAppBarVariantProps = Pick<AppBarMainVariantProps, "theme" | "tone" | "transitionStyle">;
type LayoutChangeHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;
type AppBarStyleObject = Record<string, string | number>;

interface AppBarContextValue {
  centeredTitlePaddingX: string;
  safeAreaInsetTop: string;
  sharedVariantProps: SharedAppBarVariantProps;
  setLeftWidth: (width: number) => void;
  setRightWidth: (width: number) => void;
}

const AppBarContext = React.createContext<AppBarContextValue | null>(null);
const { ClassNamesProvider: AppBarClassNamesProvider, useClassNames: useAppBarRecipeClassNames } =
  createSlotRecipeContext(appBar);
const {
  ClassNamesProvider: AppBarMainClassNamesProvider,
  useClassNames: useAppBarMainRecipeClassNames,
} = createSlotRecipeContext(appBarMain);
const APP_BAR_HEIGHT_BY_THEME: Record<AppBarTheme, string> = {
  cupertino: "44px",
  android: "56px",
};

function useAppBarContext(consumer: string): AppBarContextValue {
  const ctx = React.useContext(AppBarContext);
  if (!ctx) {
    throw new Error(`<${consumer}/> must be rendered inside <AppBarRoot/>.`);
  }
  return ctx;
}

function useAppBarClassNames(consumer: string): AppBarClassNames {
  try {
    return useAppBarRecipeClassNames();
  } catch {
    throw new Error(`<${consumer}/> must be rendered inside <AppBarRoot/>.`);
  }
}

function useAppBarMainClassNames(consumer: string): AppBarMainClassNames {
  try {
    return useAppBarMainRecipeClassNames();
  } catch {
    throw new Error(`<${consumer}/> must be rendered inside <AppBarMain/>.`);
  }
}

function getDefaultAppBarTheme(): AppBarTheme {
  const globalSystemInfo = (globalThis as typeof globalThis & { SystemInfo?: LynxSystemInfo })
    .SystemInfo;
  const systemInfo =
    globalSystemInfo ?? (typeof SystemInfo === "undefined" ? undefined : SystemInfo);

  if (systemInfo == null) return "cupertino";

  return systemInfo.platform === "Android" ? "android" : "cupertino";
}

function getLayoutWidth(event: Parameters<LayoutChangeHandler>[0]): number | null {
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

function getMainLayoutStyle(
  theme: AppBarMainVariantProps["theme"],
  safeAreaInsetTop: string,
): AppBarStyleObject | undefined {
  if (theme !== "cupertino") return undefined;

  return {
    top: safeAreaInsetTop,
    bottom: "0px",
  };
}

////////////////////////////////////////////////////////////////////////////////////

export interface AppBarRootProps extends AppBarVariantProps, LynxStyledElementProps {}

export const AppBarRoot = React.forwardRef<unknown, AppBarRootProps>((props, ref) => {
  const [variantProps, otherProps] = appBar.splitVariantProps(props);
  const { children, className, style, ...nativeProps } = otherProps;
  const { safeAreaInsetTop } = useSafeArea();
  const [leftWidth, setLeftWidth] = React.useState(0);
  const [rightWidth, setRightWidth] = React.useState(0);
  const resolvedTheme = variantProps.theme ?? getDefaultAppBarTheme();

  const resolvedVariantProps: AppBarVariantProps = {
    ...variantProps,
    theme: resolvedTheme,
  };
  const classNames = appBar(resolvedVariantProps);
  const centeredTitlePaddingX = getCenteredTitlePadding(leftWidth, rightWidth);
  const sharedVariantProps = React.useMemo<SharedAppBarVariantProps>(
    () => ({
      theme: resolvedVariantProps.theme,
      tone: resolvedVariantProps.tone,
      transitionStyle: resolvedVariantProps.transitionStyle,
    }),
    [resolvedVariantProps.theme, resolvedVariantProps.tone, resolvedVariantProps.transitionStyle],
  );
  const context = React.useMemo<AppBarContextValue>(
    () => ({
      centeredTitlePaddingX,
      safeAreaInsetTop,
      sharedVariantProps,
      setLeftWidth,
      setRightWidth,
    }),
    [centeredTitlePaddingX, safeAreaInsetTop, sharedVariantProps],
  );

  return (
    <AppBarContext.Provider value={context}>
      <AppBarClassNamesProvider value={classNames}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          {...nativeProps}
          className={clsx(classNames.root, className)}
          style={
            {
              "--seed-safe-area-top": safeAreaInsetTop,
              "--centered-title-padding-x": centeredTitlePaddingX,
              ...getRootLayoutStyle(resolvedTheme, safeAreaInsetTop),
              ...style,
            } as LynxViewProps["style"]
          }
        >
          <view accessibility-elements-hidden className={classNames.background} />
          {children}
        </view>
      </AppBarClassNamesProvider>
    </AppBarContext.Provider>
  );
});
AppBarRoot.displayName = "AppBarRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface AppBarLeftProps extends LynxStyledElementProps {
  bindlayoutchange?: LynxViewProps["bindlayoutchange"];
}

export const AppBarLeft = React.forwardRef<unknown, AppBarLeftProps>((props, ref) => {
  const { children, className, bindlayoutchange, ...nativeProps } = props;
  const { setLeftWidth } = useAppBarContext("AppBarLeft");
  const classNames = useAppBarClassNames("AppBarLeft");

  const handleLayoutChange = React.useCallback<LayoutChangeHandler>(
    (...args) => {
      bindlayoutchange?.(...args);
      const width = getLayoutWidth(args[0]);
      if (width != null) {
        setLeftWidth(width);
      }
    },
    [bindlayoutchange, setLeftWidth],
  );

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      bindlayoutchange={handleLayoutChange}
      className={clsx(classNames.left, className)}
    >
      {children}
    </view>
  );
});
AppBarLeft.displayName = "AppBarLeft";

export interface AppBarRightProps extends LynxStyledElementProps {
  bindlayoutchange?: LynxViewProps["bindlayoutchange"];
}

export const AppBarRight = React.forwardRef<unknown, AppBarRightProps>((props, ref) => {
  const { children, className, bindlayoutchange, ...nativeProps } = props;
  const { setRightWidth } = useAppBarContext("AppBarRight");
  const classNames = useAppBarClassNames("AppBarRight");

  const handleLayoutChange = React.useCallback<LayoutChangeHandler>(
    (...args) => {
      bindlayoutchange?.(...args);
      const width = getLayoutWidth(args[0]);
      if (width != null) {
        setRightWidth(width);
      }
    },
    [bindlayoutchange, setRightWidth],
  );

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      bindlayoutchange={handleLayoutChange}
      className={clsx(classNames.right, className)}
    >
      {children}
    </view>
  );
});
AppBarRight.displayName = "AppBarRight";

////////////////////////////////////////////////////////////////////////////////////

export interface AppBarMainProps extends AppBarMainVariantProps, LynxStyledElementProps {}

export const AppBarMain = React.forwardRef<unknown, AppBarMainProps>((props, ref) => {
  const { centeredTitlePaddingX, safeAreaInsetTop, sharedVariantProps } =
    useAppBarContext("AppBarMain");
  const [variantProps, otherProps] = appBarMain.splitVariantProps({
    ...sharedVariantProps,
    ...props,
  });
  const resolvedTheme = variantProps.theme ?? "cupertino";
  const classNames = appBarMain(variantProps);
  const { children, className, style, ...nativeProps } = otherProps;
  const centeredTitleStyle =
    variantProps.theme === "cupertino"
      ? {
          paddingLeft: centeredTitlePaddingX,
          paddingRight: centeredTitlePaddingX,
        }
      : undefined;

  return (
    <AppBarMainClassNamesProvider value={classNames}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classNames.root, className)}
        style={
          {
            ...centeredTitleStyle,
            ...getMainLayoutStyle(resolvedTheme, safeAreaInsetTop),
            ...style,
          } as LynxViewProps["style"]
        }
      >
        {children}
      </view>
    </AppBarMainClassNamesProvider>
  );
});
AppBarMain.displayName = "AppBarMain";

export interface AppBarTitleProps extends LynxElementProps {}

export const AppBarTitle = React.forwardRef<unknown, AppBarTitleProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classNames = useAppBarMainClassNames("AppBarTitle");

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx(classNames.title, className)}
    >
      {children}
    </text>
  );
});
AppBarTitle.displayName = "AppBarTitle";

export interface AppBarSubtitleProps extends LynxElementProps {}

export const AppBarSubtitle = React.forwardRef<unknown, AppBarSubtitleProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classNames = useAppBarMainClassNames("AppBarSubtitle");

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx(classNames.subtitle, className)}
    >
      {children}
    </text>
  );
});
AppBarSubtitle.displayName = "AppBarSubtitle";

////////////////////////////////////////////////////////////////////////////////////

export interface AppBarIconButtonProps extends LynxElementProps, LynxPressableProps {
  icon?: React.ReactElement<LynxIconElementProps>;
  "accessibility-label"?: LynxViewProps["accessibility-label"];
  "accessibility-element"?: LynxViewProps["accessibility-element"];
  "accessibility-traits"?: LynxViewProps["accessibility-traits"];
}

export const AppBarIconButton = React.forwardRef<unknown, AppBarIconButtonProps>((props, ref) => {
  const {
    children,
    className,
    icon,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits = "button",
    ...nativeProps
  } = props;
  const classNames = useAppBarClassNames("AppBarIconButton");

  if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
    console.warn("AppBarIconButton requires `accessibility-label` for accessibility.");
  }

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      accessibility-element={accessibilityElement}
      accessibility-label={accessibilityLabel}
      accessibility-traits={accessibilityTraits}
      className={clsx(classNames.iconButton, className)}
    >
      {icon ? <Icon className={classNames.icon} icon={icon} /> : children}
    </view>
  );
});
AppBarIconButton.displayName = "AppBarIconButton";

export interface AppBarSlotProps extends LynxStyledElementProps {}

export const AppBarSlot = React.forwardRef<unknown, AppBarSlotProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classNames = useAppBarClassNames("AppBarSlot");

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      className={clsx(classNames.custom, className)}
    >
      {children}
    </view>
  );
});
AppBarSlot.displayName = "AppBarSlot";
