import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useCheckbox, type UseCheckboxProps } from "./useCheckbox.js";
import { CheckboxProvider, useCheckboxContext } from "./useCheckboxContext.js";

type ViewProps = IntrinsicElements["view"];

export interface CheckboxRootProps
  extends UseCheckboxProps,
    Omit<ViewProps, keyof UseCheckboxProps> {}

/**
 * 스타일 없이 Checkbox의 선택 상태·press·접근성을 연결하는 native `<view>`입니다.
 * press와 disabled는 Root만 소유합니다. 하위 요소는 `useCheckboxContext`로
 * `checked`·`indeterminate`·`disabled`·`pressed`를 읽습니다.
 */
export const CheckboxRoot = React.forwardRef<unknown, CheckboxRootProps>((props, ref) => {
  const {
    children,
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate,
    disabled = false,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    ...nativeProps
  } = props;
  const api = useCheckbox({
    checked,
    defaultChecked,
    onCheckedChange,
    indeterminate,
    disabled,
    "accessibility-element": accessibilityElement,
    "accessibility-role-description": accessibilityRoleDescription,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
  });
  const {
    bindtap: handleTap,
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
    ...rootProps
  } = api.rootProps;

  return (
    <CheckboxProvider value={api}>
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...nativeProps}
        {...rootProps}
        bindtap={disabled ? undefined : handleTap}
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
    </CheckboxProvider>
  );
});
CheckboxRoot.displayName = "CheckboxRoot";

export interface CheckboxControlProps extends ViewProps {}

/**
 * 선택 상태를 표시하는 무스타일 native `<view>`입니다. press와 접근성 요소는 Root가 소유합니다.
 */
export const CheckboxControl = React.forwardRef<unknown, CheckboxControlProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  useCheckboxContext();

  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
      {children}
    </view>
  );
});
CheckboxControl.displayName = "CheckboxControl";
