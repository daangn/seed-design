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
import { toArray } from "../../utils/children";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { Icon } from "../Icon";
import { AppBarProvider, useAppBarContext } from "./context";
import { getLayoutWidth, getMainLayoutStyle, useAppBar } from "./useAppBar";

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
 * 아이콘 버튼의 bleed 보정 방향. `leading`은 좌측 가장자리(marginLeft), `trailing`은 우측 가장자리(marginRight).
 */
export type AppBarEdge = "leading" | "trailing";

/**
 * `AppBarLeft`/`AppBarRight`가 가장자리(첫/마지막) 자식에 `edge`를 자동 주입한다.
 * `AppBarIconButton`만 이 값을 소비해 bleed를 보정하고, 커스텀 슬롯 등 다른 요소는 무시한다.
 * 자식이 이미 `edge`를 명시했으면 존중하고 주입하지 않는다.
 */
function injectEdgeIntoChildren(children: React.ReactNode, edge: AppBarEdge): React.ReactNode {
  const items = toArray(children);
  if (items.length === 0) return children;

  // leading은 첫 번째, trailing은 마지막 유효 엘리먼트를 대상으로 한다.
  let targetIndex = -1;
  for (let offset = 0; offset < items.length; offset++) {
    const index = edge === "leading" ? offset : items.length - 1 - offset;
    if (React.isValidElement(items[index])) {
      targetIndex = index;
      break;
    }
  }
  if (targetIndex === -1) return children;

  const target = items[targetIndex] as React.ReactElement<{ edge?: AppBarEdge }>;
  if (target.props.edge !== undefined) return children;

  return items.map((child, index) => {
    if (!React.isValidElement(child)) return child;
    const element = child as React.ReactElement<{ edge?: AppBarEdge }>;
    return React.cloneElement(element, {
      key: element.key ?? index,
      ...(index === targetIndex ? { edge } : {}),
    });
  });
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
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          {...nativeProps}
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
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      bindlayoutchange={handleLayoutChange}
      className={clsx(classNames.left, className)}
    >
      {injectEdgeIntoChildren(children, "leading")}
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
      {injectEdgeIntoChildren(children, "trailing")}
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
  /**
   * 가장자리 정렬을 위한 bleed 보정 방향. 보통 `AppBarLeft`(leading)/`AppBarRight`(trailing)가
   * 가장자리 자식에 자동 주입하므로 직접 지정할 필요는 없다. 자동 주입을 덮어쓰고 싶을 때만 명시한다.
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

  if (process.env.NODE_ENV !== "production" && accessibilityElement && !accessibilityLabel) {
    console.warn("AppBarIconButton requires `accessibility-label` for accessibility.");
  }

  // 가장자리 버튼은 bleed(투명 여백)만큼 바깥으로 당겨 아이콘을 콘텐츠 여백에 정렬한다.
  // 값은 recipe가 노출하는 `--app-bar-icon-button-bleed`(테마 불변)를 참조한다.
  const edgeStyle =
    edge === "leading"
      ? { marginLeft: "var(--app-bar-icon-button-bleed)" }
      : edge === "trailing"
        ? { marginRight: "var(--app-bar-icon-button-bleed)" }
        : undefined;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      {...(edgeStyle ? { style: edgeStyle as LynxViewProps["style"] } : {})}
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

export interface AppBarSlotProps extends LynxStyledElementProps {
  /**
   * @internal `AppBarLeft`/`AppBarRight`가 가장자리 자식에 주입하는 값. 커스텀 슬롯은 bleed 보정을
   * 받지 않으므로 흡수만 하고 무시한다(네이티브 `<view>`로 전달되지 않게 차단).
   */
  edge?: AppBarEdge;
}

export const AppBarSlot = React.forwardRef<unknown, AppBarSlotProps>((props, ref) => {
  const { children, className, edge: _edge, ...nativeProps } = props;
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
