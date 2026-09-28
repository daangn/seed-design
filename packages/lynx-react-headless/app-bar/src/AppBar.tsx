import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useAppBar } from "./useAppBar.js";
import { AppBarContext } from "./useAppBarContext.js";
import { useAppBarIconButton, type UseAppBarIconButtonProps } from "./useAppBarIconButton.js";
import { useAppBarSide } from "./useAppBarSide.js";

type ViewProps = IntrinsicElements["view"];

export interface AppBarRootProps extends ViewProps {}

/** safe area와 좌우 슬롯 폭을 Context로 제공한다. 높이·padding·배치는 소비자가 정한다. */
export const AppBarRoot = React.forwardRef<unknown, AppBarRootProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  const api = useAppBar();

  return (
    <AppBarContext.Provider value={api}>
      <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
        {children}
      </view>
    </AppBarContext.Provider>
  );
});
AppBarRoot.displayName = "AppBarRoot";

export interface AppBarLeftProps extends ViewProps {}

export const AppBarLeft = React.forwardRef<unknown, AppBarLeftProps>((props, ref) => {
  const { children, bindlayoutchange, ...nativeProps } = props;
  const { sideProps } = useAppBarSide({ side: "left", bindlayoutchange });

  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps} {...sideProps}>
      {children}
    </view>
  );
});
AppBarLeft.displayName = "AppBarLeft";

export interface AppBarRightProps extends ViewProps {}

export const AppBarRight = React.forwardRef<unknown, AppBarRightProps>((props, ref) => {
  const { children, bindlayoutchange, ...nativeProps } = props;
  const { sideProps } = useAppBarSide({ side: "right", bindlayoutchange });

  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps} {...sideProps}>
      {children}
    </view>
  );
});
AppBarRight.displayName = "AppBarRight";

export interface AppBarIconButtonProps extends ViewProps, UseAppBarIconButtonProps {}

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
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps} {...iconButtonProps}>
      {children}
    </view>
  );
});
AppBarIconButton.displayName = "AppBarIconButton";
