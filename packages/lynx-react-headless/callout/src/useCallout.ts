import { useMemo } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";
import type { IntrinsicElements } from "@lynx-js/types";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";

type ViewProps = IntrinsicElements["view"];
type CalloutAccessibilityProps = Pick<ViewProps, "accessibility-element" | "accessibility-traits">;
type MainThreadTouchProps = Pick<
  ViewProps,
  "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
>;

export interface UseCalloutProps extends CalloutAccessibilityProps, MainThreadTouchProps {
  /**
   * 처음 렌더링할 때 Callout을 표시할지 여부입니다. `open`이 없을 때만 사용합니다.
   * @default true
   */
  defaultOpen?: boolean;

  /**
   * Callout 표시 여부입니다. 지정하면 `dismiss`가 값을 바꾸지 않고 `onDismiss`만 호출합니다.
   */
  open?: boolean;

  /**
   * 열린 Callout에서 `dismiss`를 호출하면 한 번 실행됩니다. 닫힌 상태에서는 호출하지 않습니다.
   */
  onDismiss?: () => void;

  /**
   * 지정하면 Root가 탭할 수 있는 상태가 되어 눌림 상태와 `button` 접근성 기본값을 연결합니다.
   */
  bindtap?: ViewProps["bindtap"];

  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
}

export interface UseCalloutReturn {
  open: boolean;
  /** `bindtap` 또는 `main-thread:bindtap`이 있을 때 `true`입니다. */
  interactive: boolean;
  /** 누르고 있는 동안 `true`입니다. `interactive`가 아니면 항상 `false`입니다. */
  pressed: boolean;
  /** 열린 Callout을 닫고 `onDismiss`를 호출합니다. 이미 닫혔으면 아무것도 하지 않습니다. */
  dismiss: () => void;
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
    defaultOpen = true,
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
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen });
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
  const dismiss = useMemoizedFn(() => {
    "background only";
    if (!open) return;

    setOpen(false);
    onDismiss?.();
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
