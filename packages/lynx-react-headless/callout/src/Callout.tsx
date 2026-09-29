import * as React from "@lynx-js/react";
import { runOnBackground } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useCallout, type UseCalloutProps } from "./useCallout.js";
import { CalloutContext } from "./useCalloutContext.js";
import { useCalloutCloseButton, type UseCalloutCloseButtonProps } from "./useCalloutCloseButton.js";

type ViewProps = IntrinsicElements["view"];
type MainThreadTouchEvent = Parameters<NonNullable<ViewProps["main-thread:bindtouchstart"]>>[0];

export interface CalloutRootProps extends UseCalloutProps, Omit<ViewProps, keyof UseCalloutProps> {}

/**
 * 스타일 없이 Callout의 표시 상태와 탭할 수 있는 Root를 연결하는 native `<view>`입니다.
 * 닫히면 아무것도 렌더링하지 않습니다. 하위 요소는 `useCalloutContext`로 `pressed`·`dismiss`를 읽습니다.
 */
export const CalloutRoot = React.forwardRef<unknown, CalloutRootProps>((props, ref) => {
  const {
    children,
    defaultOpen,
    open,
    onDismiss,
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
  const api = useCallout({
    defaultOpen,
    open,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
  });

  if (!api.open) return null;

  const {
    bindtouchstart: pressStart,
    bindtouchend: pressEnd,
    bindtouchcancel: pressCancel,
    ...rootProps
  } = api.rootProps;
  const touchProps: Pick<
    ViewProps,
    | "bindtouchstart"
    | "bindtouchend"
    | "bindtouchcancel"
    | "main-thread:bindtouchstart"
    | "main-thread:bindtouchend"
    | "main-thread:bindtouchcancel"
  > = {
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
  };

  if (pressStart && pressEnd && pressCancel) {
    touchProps.bindtouchstart = (event) => {
      bindtouchstart?.(event);
      pressStart(event);
    };
    touchProps.bindtouchend = (event) => {
      bindtouchend?.(event);
      pressEnd(event);
    };
    touchProps.bindtouchcancel = (event) => {
      bindtouchcancel?.(event);
      pressCancel(event);
    };
    // A Main Thread handler replaces the Background handler of the same native event.
    // Run the consumer handler there and forward only the press state update.
    if (mainThreadBindtouchstart) {
      touchProps["main-thread:bindtouchstart"] = (event: MainThreadTouchEvent) => {
        "main thread";
        mainThreadBindtouchstart(event);
        runOnBackground(pressStart)();
      };
    }
    if (mainThreadBindtouchend) {
      touchProps["main-thread:bindtouchend"] = (event: MainThreadTouchEvent) => {
        "main thread";
        mainThreadBindtouchend(event);
        runOnBackground(pressEnd)();
      };
    }
    if (mainThreadBindtouchcancel) {
      touchProps["main-thread:bindtouchcancel"] = (event: MainThreadTouchEvent) => {
        "main thread";
        mainThreadBindtouchcancel(event);
        runOnBackground(pressCancel)();
      };
    }
  }

  return (
    <CalloutContext.Provider value={api}>
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...nativeProps}
        {...rootProps}
        {...touchProps}
      >
        {children}
      </view>
    </CalloutContext.Provider>
  );
});
CalloutRoot.displayName = "CalloutRoot";

export interface CalloutCloseButtonProps
  extends UseCalloutCloseButtonProps,
    Omit<ViewProps, keyof UseCalloutCloseButtonProps> {}

/**
 * 스타일 없이 Callout을 닫는 native `<view>`입니다. 사용자 `bindtap`을 실행한 뒤 `dismiss`를 호출합니다.
 * tap을 catch하지 않으므로 native 이벤트는 Root로 전파됩니다.
 */
export const CalloutCloseButton = React.forwardRef<unknown, CalloutCloseButtonProps>(
  (props, ref) => {
    const {
      children,
      bindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = props;
    const { closeButtonProps } = useCalloutCloseButton({
      bindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-traits": accessibilityTraits,
    });

    return (
      <view
        {...(ref ? { ref: ref as ViewProps["ref"] } : {})}
        {...nativeProps}
        {...closeButtonProps}
      >
        {children}
      </view>
    );
  },
);
CalloutCloseButton.displayName = "CalloutCloseButton";
