import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useAppBar } from "./useAppBar.js";
import { AppBarProvider } from "./useAppBarContext.js";
import { useAppBarIconButton, type UseAppBarIconButtonProps } from "./useAppBarIconButton.js";
import { useAppBarSide } from "./useAppBarSide.js";

type ViewProps = IntrinsicElements["view"];

export interface AppBarRootProps extends ViewProps {}

/** safe area와 좌우 슬롯 폭을 Context로 제공한다. 높이·padding·배치는 소비자가 정한다. */
export const AppBarRoot = React.forwardRef<unknown, AppBarRootProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  const api = useAppBar();

  return (
    <AppBarProvider value={api}>
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
    </AppBarProvider>
  );
});
AppBarRoot.displayName = "AppBarRoot";

export interface AppBarLeftProps extends ViewProps {}

export const AppBarLeft = React.forwardRef<unknown, AppBarLeftProps>((props, ref) => {
  const { children, bindlayoutchange, ...nativeProps } = props;
  const { sideProps } = useAppBarSide({ side: "left", bindlayoutchange });

  return (
    <view {...sideProps} {...nativeProps} {...(ref ? { ref: ref as ViewProps["ref"] } : {})}>
      {children}
    </view>
  );
});
AppBarLeft.displayName = "AppBarLeft";

export interface AppBarMainProps extends ViewProps {}

/** 제목 영역의 native view다. 가운데 정렬 padding과 safe area 배치는 소비자가 `useAppBarContext()` 값으로 정한다. */
export const AppBarMain = React.forwardRef<unknown, AppBarMainProps>((props, ref) => {
  const { children, ...nativeProps } = props;

  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
      {children}
    </view>
  );
});
AppBarMain.displayName = "AppBarMain";

export interface AppBarRightProps extends ViewProps {}

export const AppBarRight = React.forwardRef<unknown, AppBarRightProps>((props, ref) => {
  const { children, bindlayoutchange, ...nativeProps } = props;
  const { sideProps } = useAppBarSide({ side: "right", bindlayoutchange });

  return (
    <view {...sideProps} {...nativeProps} {...(ref ? { ref: ref as ViewProps["ref"] } : {})}>
      {children}
    </view>
  );
});
AppBarRight.displayName = "AppBarRight";

export interface AppBarIconButtonProps
  extends UseAppBarIconButtonProps,
    Omit<ViewProps, keyof UseAppBarIconButtonProps> {}

export const AppBarIconButton = React.forwardRef<unknown, AppBarIconButtonProps>((props, ref) => {
  const {
    children,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const { iconButtonProps } = useAppBarIconButton({
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
  });

  return (
    <view {...iconButtonProps} {...nativeProps} {...(ref ? { ref: ref as ViewProps["ref"] } : {})}>
      {children}
    </view>
  );
});
AppBarIconButton.displayName = "AppBarIconButton";
