import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";

type ViewProps = IntrinsicElements["view"];
type ActionButtonAccessibilityProps = Pick<
  ViewProps,
  "accessibility-element" | "accessibility-traits"
>;
type MainThreadTouchProps = Pick<
  ViewProps,
  "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
>;

export interface UseActionButtonProps extends ActionButtonAccessibilityProps, MainThreadTouchProps {
  /**
   * 버튼의 비활성화 여부입니다. `true`이면 tap과 눌림 상태가 막힙니다.
   * @default false
   */
  disabled?: boolean;

  /**
   * 버튼에 등록된 비동기 작업이 진행 중임을 나타냅니다. `disabled`와 같이 tap과 눌림 상태를 막습니다.
   * @default false
   */
  loading?: boolean;

  bindtap?: ViewProps["bindtap"];

  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
}

export interface UseActionButtonReturn {
  disabled: boolean;
  loading: boolean;
  /** `disabled`와 `loading`이 모두 `false`일 때만 `true`입니다. */
  interactive: boolean;
  /** 누르고 있는 동안 `true`입니다. `interactive`가 아니면 항상 `false`입니다. */
  pressed: boolean;
  /**
   * Root native view에 펼칩니다. `interactive`가 아니면 tap을 호출하지 않습니다.
   * 소비자의 `main-thread:bindtouch*`는 눌림 상태와 합성된 handler로 포함됩니다.
   */
  rootProps: Required<ActionButtonAccessibilityProps> &
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
 * ActionButton의 tap·눌림 상태·접근성 기본값을 제공하는 headless 훅입니다.
 * `disabled`와 `loading`은 모두 `bindtap`과 `main-thread:bindtap`을 막고, `accessibility-traits`를
 * 따로 주지 않으면 `"disabled"`로 알립니다.
 */
export function useActionButton(props: UseActionButtonProps = {}): UseActionButtonReturn {
  const {
    disabled = false,
    loading = false,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraitsProp,
  } = props;
  const interactive = !disabled && !loading;
  const accessibilityTraits = accessibilityTraitsProp ?? (interactive ? "button" : "disabled");
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

  return useMemo<UseActionButtonReturn>(
    () => ({
      disabled,
      loading,
      interactive,
      pressed,
      rootProps: {
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
      loading,
      interactive,
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
