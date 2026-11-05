import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";
import { useFileUploadContext } from "./useFileUploadContext.js";

type ViewProps = IntrinsicElements["view"];
type TriggerAccessibilityProps = Pick<ViewProps, "accessibility-element" | "accessibility-traits">;
type MainThreadTouchProps = Pick<
  ViewProps,
  "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
>;

export interface UseFileUploadTriggerProps extends TriggerAccessibilityProps, MainThreadTouchProps {
  /** 파일 선택을 시작한 뒤 호출합니다. */
  bindtap?: ViewProps["bindtap"];
  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
}

export interface UseFileUploadTriggerReturn {
  /** Root의 `triggerDisabled`와 같습니다. */
  disabled: boolean;
  /** 누르고 있는 동안 `true`입니다. `disabled`이면 항상 `false`입니다. */
  pressed: boolean;
  /**
   * Trigger native view에 펼칩니다. tap하면 `openFilePicker`를 호출합니다.
   * 소비자의 `main-thread:bindtouch*`는 눌림 상태와 합성된 handler로 포함됩니다.
   */
  triggerProps: Required<TriggerAccessibilityProps> &
    MainThreadTouchProps & {
      bindtap: UsePressTapReturn["bindtap"];
      bindtouchstart: UsePressTapReturn["bindtouchstart"];
      bindtouchend: UsePressTapReturn["bindtouchend"];
      bindtouchcancel: UsePressTapReturn["bindtouchcancel"];
      "main-thread:bindtap"?: UsePressTapReturn["main-thread:bindtap"];
    };
}

/**
 * @platform Lynx
 *
 * 파일 선택 Trigger의 tap·눌림 상태·접근성 기본값을 만듭니다. `FileUploadRoot` 안에서 호출합니다.
 * `triggerDisabled`이면 tap을 막고 `accessibility-traits`를 따로 주지 않으면 `"disabled"`로 알립니다.
 */
export function useFileUploadTrigger(
  props: UseFileUploadTriggerProps = {},
): UseFileUploadTriggerReturn {
  const {
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraitsProp,
  } = props;
  const { triggerDisabled: disabled, openFilePicker } = useFileUploadContext();
  const accessibilityTraits = accessibilityTraitsProp ?? (disabled ? "disabled" : "button");
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
    disabled,
    onTap: (event) => {
      openFilePicker();
      bindtap?.(event);
    },
    mainThreadOnTap: mainThreadBindtap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  return useMemo<UseFileUploadTriggerReturn>(
    () => ({
      disabled,
      pressed,
      triggerProps: {
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
        "accessibility-element": accessibilityElement,
        "accessibility-traits": accessibilityTraits,
      },
    }),
    [
      disabled,
      pressed,
      handleTap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      handleMainThreadTap,
      handleMainThreadTouchStart,
      handleMainThreadTouchEnd,
      handleMainThreadTouchCancel,
      accessibilityElement,
      accessibilityTraits,
    ],
  );
}
