import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import {
  useDismissible,
  type UseDismissibleProps,
  type UseDismissibleReturn,
} from "@seed-design/lynx-react-use-dismissible";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";

type ViewProps = IntrinsicElements["view"];
type CalloutAccessibilityProps = Pick<ViewProps, "accessibility-element" | "accessibility-traits">;
type MainThreadTouchProps = Pick<
  ViewProps,
  "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
>;

export interface UseCalloutProps
  extends UseDismissibleProps,
    CalloutAccessibilityProps,
    MainThreadTouchProps {
  /**
   * 지정하면 Root가 탭할 수 있는 상태가 되어 눌림 상태와 `button` 접근성 기본값을 연결합니다.
   */
  bindtap?: ViewProps["bindtap"];

  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
}

export interface UseCalloutReturn extends UseDismissibleReturn {
  /** `bindtap` 또는 `main-thread:bindtap`이 있을 때 `true`입니다. */
  interactive: boolean;
  /** 누르고 있는 동안 `true`입니다. `interactive`가 아니면 항상 `false`입니다. */
  pressed: boolean;
  /**
   * Root native view에 펼칩니다. `interactive`일 때만 tap·touch handler와
   * `accessibility-element={true}`, `accessibility-traits="button"` 기본값을 포함합니다.
   * 소비자의 `main-thread:bindtouch*`는 `interactive`일 때 눌림 상태와 합성된 handler로,
   * 아니면 그대로 포함됩니다.
   */
  rootProps: CalloutAccessibilityProps &
    MainThreadTouchProps &
    Partial<
      Pick<
        UsePressTapReturn,
        "bindtap" | "bindtouchstart" | "bindtouchend" | "bindtouchcancel" | "main-thread:bindtap"
      >
    >;
}

/**
 * @platform Lynx
 *
 * Callout의 표시 상태, dismiss, 탭할 수 있는 Root의 눌림 상태와 접근성 기본값을 제공하는 headless 훅입니다.
 */
export function useCallout(props: UseCalloutProps = {}): UseCalloutReturn {
  const {
    defaultOpen,
    open: openProp,
    onDismiss,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement,
    "accessibility-traits": accessibilityTraits,
  } = props;
  const { open, dismiss } = useDismissible({ defaultOpen, open: openProp, onDismiss });
  const interactive = bindtap != null || mainThreadBindtap != null;
  const {
    pressed,
    bindtap: handleTap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": handleMainThreadTap,
    "main-thread:bindtouchstart": handleMainThreadTouchStart,
    "main-thread:bindtouchend": handleMainThreadTouchEnd,
    "main-thread:bindtouchcancel": handleMainThreadTouchCancel,
  } = usePressTap({
    disabled: !interactive,
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  return useMemo<UseCalloutReturn>(
    () => ({
      open,
      interactive,
      pressed,
      dismiss,
      rootProps: interactive
        ? {
            bindtap: handleTap,
            bindtouchstart,
            bindtouchend,
            bindtouchcancel,
            ...(handleMainThreadTap ? { "main-thread:bindtap": handleMainThreadTap } : {}),
            ...(handleMainThreadTouchStart
              ? { "main-thread:bindtouchstart": handleMainThreadTouchStart }
              : {}),
            ...(handleMainThreadTouchEnd
              ? { "main-thread:bindtouchend": handleMainThreadTouchEnd }
              : {}),
            ...(handleMainThreadTouchCancel
              ? { "main-thread:bindtouchcancel": handleMainThreadTouchCancel }
              : {}),
            "accessibility-element": accessibilityElement ?? true,
            "accessibility-traits": accessibilityTraits ?? "button",
          }
        : {
            ...(mainThreadOnTouchStart
              ? { "main-thread:bindtouchstart": mainThreadOnTouchStart }
              : {}),
            ...(mainThreadOnTouchEnd ? { "main-thread:bindtouchend": mainThreadOnTouchEnd } : {}),
            ...(mainThreadOnTouchCancel
              ? { "main-thread:bindtouchcancel": mainThreadOnTouchCancel }
              : {}),
            "accessibility-element": accessibilityElement,
            "accessibility-traits": accessibilityTraits,
          },
    }),
    [
      open,
      interactive,
      pressed,
      dismiss,
      handleTap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      handleMainThreadTap,
      handleMainThreadTouchStart,
      handleMainThreadTouchEnd,
      handleMainThreadTouchCancel,
      mainThreadOnTouchStart,
      mainThreadOnTouchEnd,
      mainThreadOnTouchCancel,
      accessibilityElement,
      accessibilityTraits,
    ],
  );
}
