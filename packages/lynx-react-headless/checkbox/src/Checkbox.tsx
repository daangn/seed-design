import * as React from "@lynx-js/react";
import { runOnBackground } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useCheckbox, type UseCheckboxProps } from "./useCheckbox.js";
import { CheckboxContext, useCheckboxContext } from "./useCheckboxContext.js";

type ViewProps = IntrinsicElements["view"];
type MainThreadTouchEvent = Parameters<NonNullable<ViewProps["main-thread:bindtouchstart"]>>[0];

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
  });
  const {
    bindtap: toggle,
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
    ...accessibilityProps
  } = api.rootProps;

  // A Main Thread handler replaces the Background handler of the same native event.
  // Run the consumer handler there and forward only the press state update.
  const handleMainThreadTouchStart = mainThreadBindtouchstart
    ? (event: MainThreadTouchEvent) => {
        "main thread";
        mainThreadBindtouchstart(event);
        runOnBackground(pressStart)();
      }
    : undefined;
  const handleMainThreadTouchEnd = mainThreadBindtouchend
    ? (event: MainThreadTouchEvent) => {
        "main thread";
        mainThreadBindtouchend(event);
        runOnBackground(pressEnd)();
      }
    : undefined;
  const handleMainThreadTouchCancel = mainThreadBindtouchcancel
    ? (event: MainThreadTouchEvent) => {
        "main thread";
        mainThreadBindtouchcancel(event);
        runOnBackground(pressCancel)();
      }
    : undefined;

  return (
    <CheckboxContext.Provider value={api}>
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...nativeProps}
        {...accessibilityProps}
        {...(!disabled && mainThreadBindtap ? { "main-thread:bindtap": mainThreadBindtap } : {})}
        {...(handleMainThreadTouchStart
          ? { "main-thread:bindtouchstart": handleMainThreadTouchStart }
          : {})}
        {...(handleMainThreadTouchEnd
          ? { "main-thread:bindtouchend": handleMainThreadTouchEnd }
          : {})}
        {...(handleMainThreadTouchCancel
          ? { "main-thread:bindtouchcancel": handleMainThreadTouchCancel }
          : {})}
        bindtap={
          disabled
            ? undefined
            : (event) => {
                bindtap?.(event);
                toggle(event);
              }
        }
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
    </CheckboxContext.Provider>
  );
});
CheckboxRoot.displayName = "CheckboxRoot";

export interface CheckboxControlProps extends ViewProps {}

/**
 * 선택 상태를 표시하는 무스타일 native `<view>`입니다. press와 접근성 요소는 Root가 소유합니다.
 */
export const CheckboxControl = React.forwardRef<unknown, CheckboxControlProps>((props, ref) => {
  const { children, ...nativeProps } = props;
  useCheckboxContext("CheckboxControl");

  return (
    <view {...(ref ? { ref: ref as ViewProps["ref"] } : {})} {...nativeProps}>
      {children}
    </view>
  );
});
CheckboxControl.displayName = "CheckboxControl";
