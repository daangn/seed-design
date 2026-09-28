import * as React from "@lynx-js/react";
import { runOnBackground } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useActionButton, type UseActionButtonProps } from "./useActionButton.js";
import { ActionButtonContext } from "./useActionButtonContext.js";

type ViewProps = IntrinsicElements["view"];
type MainThreadTouchEvent = Parameters<NonNullable<ViewProps["main-thread:bindtouchstart"]>>[0];

export interface ActionButtonRootProps
  extends UseActionButtonProps,
    Omit<ViewProps, keyof UseActionButtonProps | "flatten"> {}

/**
 * 스타일 없이 ActionButton의 tap·눌림 상태·접근성을 연결하는 native `<view>`입니다.
 * 하위 요소는 `useActionButtonContext`로 `pressed`·`loading`·`disabled`를 읽습니다.
 */
export const ActionButtonRoot = React.forwardRef<unknown, ActionButtonRootProps>((props, ref) => {
  const {
    children,
    disabled,
    loading,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    ...nativeProps
  } = props;
  const api = useActionButton({
    disabled,
    loading,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
  });
  const { rootProps } = api;
  const {
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
  } = rootProps;

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
    <ActionButtonContext.Provider value={api}>
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...nativeProps}
        {...rootProps}
        {...(handleMainThreadTouchStart
          ? { "main-thread:bindtouchstart": handleMainThreadTouchStart }
          : {})}
        {...(handleMainThreadTouchEnd
          ? { "main-thread:bindtouchend": handleMainThreadTouchEnd }
          : {})}
        {...(handleMainThreadTouchCancel
          ? { "main-thread:bindtouchcancel": handleMainThreadTouchCancel }
          : {})}
        flatten={false}
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
    </ActionButtonContext.Provider>
  );
});
ActionButtonRoot.displayName = "ActionButtonRoot";
