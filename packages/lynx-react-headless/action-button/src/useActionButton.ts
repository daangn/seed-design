import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";

type ViewProps = IntrinsicElements["view"];
type ActionButtonAccessibilityProps = Pick<
  ViewProps,
  "accessibility-element" | "accessibility-traits"
>;

export interface UseActionButtonProps extends ActionButtonAccessibilityProps {
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
  /** Root native view에 펼칩니다. `interactive`가 아니면 tap을 호출하지 않습니다. */
  rootProps: Required<ActionButtonAccessibilityProps> & {
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
 * `disabled`와 `loading`은 모두 `bindtap`과 `main-thread:bindtap`을 막습니다.
 */
export function useActionButton(props: UseActionButtonProps = {}): UseActionButtonReturn {
  const {
    disabled = false,
    loading = false,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-traits": accessibilityTraits = "button",
  } = props;
  const interactive = !disabled && !loading;
  const {
    pressed,
    bindtap: handleTap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": handleMainThreadTap,
  } = usePressTap({
    disabled: !interactive,
    onTap: bindtap,
    mainThreadOnTap: mainThreadBindtap,
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
      accessibilityElement,
      accessibilityTraits,
    ],
  );
}
