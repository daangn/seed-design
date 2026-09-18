import { appBar, type AppBarVariantProps } from "@seed-design/lynx-css/recipes/app-bar";
import {
  appBarMain,
  type AppBarMainVariantProps,
} from "@seed-design/lynx-css/recipes/app-bar-main";
import * as React from "@lynx-js/react";
import clsx from "clsx";

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
import { AppBarProvider, useAppBarContext } from "./context";
import { getLayoutWidth, getMainLayoutStyle, useAppBar } from "./useAppBar";
import { mergeProps } from "../../utils/merge-props";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";

type AppBarClassNames = ReturnType<typeof appBar>;
type AppBarMainClassNames = ReturnType<typeof appBarMain>;
type LayoutChangeHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;

const { ClassNamesProvider: AppBarClassNamesProvider, useClassNames: useAppBarRecipeClassNames } =
  createSlotRecipeContext(appBar);
const {
  ClassNamesProvider: AppBarMainClassNamesProvider,
  useClassNames: useAppBarMainRecipeClassNames,
} = createSlotRecipeContext(appBarMain);

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

/**
 * 아이콘 버튼의 bleed 보정 방향. `leading`은 왼쪽, `trailing`은 오른쪽, `both`는 양쪽.
 */
export type AppBarEdge = "leading" | "trailing" | "both";

const AppBarEdgeContext = React.createContext<AppBarEdge | undefined>(undefined);

/** Fragments and arrays do not create layout boxes; retain their keys and nesting. */
function countEdgeChildren(children: React.ReactNode): number {
  if (children == null || children === "" || typeof children === "boolean") return 0;
  if (Array.isArray(children))
    return children.reduce((count, child) => count + countEdgeChildren(child), 0);
  if (
    React.isValidElement<{ children?: React.ReactNode }>(children) &&
    children.type === React.Fragment
  ) {
    return countEdgeChildren(children.props.children);
  }
  return 1;
}

// Lynx lacks :first-child/:last-child; pass both slot edges through Context to match
// web spacing without shrinking the icon button's touch target.
function provideEdgeToChildren(children: React.ReactNode): React.ReactNode {
  const lastIndex = countEdgeChildren(children) - 1;
  let index = 0;

  function visit(child: React.ReactNode): React.ReactNode {
    if (child == null || child === "" || typeof child === "boolean") return child;
    if (Array.isArray(child)) return child.map(visit);
    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.type === React.Fragment
    ) {
      return React.cloneElement(child, { children: visit(child.props.children) });
    }

    const childIndex = index++;
    const edge =
      childIndex === 0
        ? childIndex === lastIndex
          ? "both"
          : "leading"
        : childIndex === lastIndex
          ? "trailing"
          : undefined;
    if (!React.isValidElement(child)) return child;
    // Native boxes and custom slots own their layout; do not pass an automatic edge into them.
    const automaticEdge =
      typeof child.type !== "string" && child.type !== AppBarSlot ? edge : undefined;
    return (
      <AppBarEdgeContext.Provider key={child.key} value={automaticEdge}>
        {child}
      </AppBarEdgeContext.Provider>
    );
  }

  return visit(children);
}

////////////////////////////////////////////////////////////////////////////////////

export interface AppBarRootProps extends AppBarVariantProps, LynxStyledElementProps {}

export const AppBarRoot = React.forwardRef<unknown, AppBarRootProps>((props, ref) => {
  const [variantProps, otherProps] = appBar.splitVariantProps(props);
  const { children, className, style, ...nativeProps } = otherProps;
  const { contextValue, resolvedVariantProps, rootLayoutStyle } = useAppBar(variantProps);
  const classNames = appBar(resolvedVariantProps);

  return (
    <AppBarProvider value={contextValue}>
      <AppBarClassNamesProvider value={classNames}>
        <view
          {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
          className={clsx(classNames.root, className)}
          style={
            {
              "--seed-safe-area-top": contextValue.safeAreaInsetTop,
              "--centered-title-padding-x": contextValue.centeredTitlePaddingX,
              ...rootLayoutStyle,
              ...style,
            } as LynxViewProps["style"]
          }
        >
          <view accessibility-elements-hidden className={classNames.background} />
          {children}
        </view>
      </AppBarClassNamesProvider>
    </AppBarProvider>
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
      {...mergeProps(
        { bindlayoutchange: handleLayoutChange },
        ref ? { ref: ref as LynxViewRef } : {},
        nativeProps,
      )}
      className={clsx(classNames.left, className)}
    >
      {provideEdgeToChildren(children)}
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
      {...mergeProps(
        { bindlayoutchange: handleLayoutChange },
        ref ? { ref: ref as LynxViewRef } : {},
        nativeProps,
      )}
      className={clsx(classNames.right, className)}
    >
      {provideEdgeToChildren(children)}
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
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
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
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
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
      {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
      className={clsx(classNames.subtitle, className)}
    >
      {children}
    </text>
  );
});
AppBarSubtitle.displayName = "AppBarSubtitle";

////////////////////////////////////////////////////////////////////////////////////

export interface AppBarIconButtonProps
  extends Omit<LynxElementProps, "flatten">,
    LynxPressableProps {
  icon?: React.ReactElement<LynxIconElementProps>;
  "accessibility-label"?: LynxViewProps["accessibility-label"];
  "accessibility-element"?: LynxViewProps["accessibility-element"];
  "accessibility-traits"?: LynxViewProps["accessibility-traits"];
  /**
   * 슬롯의 첫·마지막 자식이 아이콘 버튼이면 해당 방향을, 유일한 자식이면 양쪽을 자동 보정한다.
   * 명시하면 `AppBarLeft` / `AppBarRight`에서 감지한 자동 보정 방향을 덮어쓴다.
   */
  edge?: AppBarEdge;
}

export const AppBarIconButton = React.forwardRef<unknown, AppBarIconButtonProps>((props, ref) => {
  const {
    children,
    className,
    icon,
    edge,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits = "button",
    ...nativeProps
  } = props;
  const classNames = useAppBarClassNames("AppBarIconButton");
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback();
  const automaticEdge = React.useContext(AppBarEdgeContext);
  const resolvedEdge = edge ?? automaticEdge;

  if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
    console.warn("AppBarIconButton requires `accessibility-label` for accessibility.");
  }

  return (
    <view
      {...mergeProps(
        ref ? { ref: ref as LynxViewRef } : {},
        scaleFeedbackTriggerProps,
        scaleFeedbackTargetProps,
        nativeProps,
      )}
      flatten={false}
      accessibility-element={accessibilityElement}
      accessibility-label={accessibilityLabel}
      accessibility-traits={accessibilityTraits}
      className={clsx(
        classNames.iconButton,
        (resolvedEdge === "leading" || resolvedEdge === "both") &&
          "seed-app-bar__icon-button-edge-leading",
        (resolvedEdge === "trailing" || resolvedEdge === "both") &&
          "seed-app-bar__icon-button-edge-trailing",
        className,
      )}
    >
      {icon ? <Icon className={classNames.icon} icon={icon} /> : children}
    </view>
  );
});
AppBarIconButton.displayName = "AppBarIconButton";

export interface AppBarSlotProps extends LynxStyledElementProps {
  /**
   * @internal 커스텀 슬롯에서는 bleed 보정을 적용하지 않는다. 전달된 값은 native 속성에서 제외한다.
   */
  edge?: AppBarEdge;
}

export const AppBarSlot = React.forwardRef<unknown, AppBarSlotProps>((props, ref) => {
  const { children, className, edge: _edge, ...nativeProps } = props;
  const classNames = useAppBarClassNames("AppBarSlot");

  return (
    <AppBarEdgeContext.Provider value={undefined}>
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classNames.custom, className)}
      >
        {children}
      </view>
    </AppBarEdgeContext.Provider>
  );
});
AppBarSlot.displayName = "AppBarSlot";
