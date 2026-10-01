import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useSwitch, type UseSwitchProps } from "./useSwitch.js";
import { SwitchProvider, useSwitchContext } from "./useSwitchContext.js";

type ViewProps = IntrinsicElements["view"];

export interface SwitchRootProps extends UseSwitchProps, Omit<ViewProps, keyof UseSwitchProps> {}

/**
 * 스타일 없이 Switch의 선택 상태·press·접근성을 연결하는 native `<view>`입니다.
 * press와 disabled는 Root만 소유합니다. 하위 요소는 `useSwitchContext`로
 * `checked`·`disabled`·`pressed`를 읽습니다.
 */
export const SwitchRoot = React.forwardRef<unknown, SwitchRootProps>((props, ref) => {
  const {
    children,
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    bindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    ...nativeProps
  } = props;
  const api = useSwitch({
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
  });
  const {
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
    ...rootProps
  } = api.rootProps;

  return (
    <SwitchProvider value={api}>
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...rootProps}
        {...nativeProps}
        bindtouchstart={(event) => {
          bindtouchstart?.(event);
          pressStart(event);
        }}
        bindtouchend={(event) => {
          bindtouchend?.(event);
          pressEnd(event);
        }}
        bindtouchcancel={(event) => {
          bindtouchcancel?.(event);
          pressCancel(event);
        }}
      >
        {children}
      </view>
    </SwitchProvider>
  );
});
SwitchRoot.displayName = "SwitchRoot";

export interface SwitchControlProps extends ViewProps {}

/**
 * 선택 상태를 표시하는 무스타일 native `<view>`입니다. press와 접근성 요소는 Root가 소유합니다.
 */
export const SwitchControl = React.forwardRef<unknown, SwitchControlProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  useSwitchContext();

  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
      {children}
    </view>
  );
});
SwitchControl.displayName = "SwitchControl";

export interface SwitchThumbProps extends ViewProps {}

/**
 * 선택 상태에 따라 움직이는 무스타일 native `<view>`입니다. Root 안이면 Control 밖에서도 렌더링할 수 있습니다.
 */
export const SwitchThumb = React.forwardRef<unknown, SwitchThumbProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  useSwitchContext();

  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
      {children}
    </view>
  );
});
SwitchThumb.displayName = "SwitchThumb";
