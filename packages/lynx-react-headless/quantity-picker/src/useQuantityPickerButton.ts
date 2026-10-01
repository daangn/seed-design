import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";
import { useQuantityPickerContext } from "./useQuantityPickerContext.js";

type ViewProps = IntrinsicElements["view"];
type TapEvent = Parameters<NonNullable<ViewProps["bindtap"]>>[0];
type ButtonAccessibilityProps = Pick<
  ViewProps,
  | "accessibility-element"
  | "accessibility-label"
  | "accessibility-role-description"
  | "accessibility-traits"
>;
type MainThreadTouchProps = Pick<
  ViewProps,
  "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
>;

export interface UseQuantityPickerButtonProps
  extends ButtonAccessibilityProps,
    MainThreadTouchProps {
  /** 사용자 tap handler입니다. action이 막혀 있지 않을 때만 수량 변경 또는 Remove 뒤에 실행됩니다. */
  bindtap?: ViewProps["bindtap"];
  /** action이 막혀 있지 않을 때만 `buttonProps`에 포함됩니다. */
  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
}

export interface UseQuantityPickerButtonReturn {
  /** `disabled`, `readOnly` 또는 경계로 action을 실행할 수 없으면 `true`입니다. */
  disabled: boolean;
  /** 이 action이 loading 상태이면 `true`입니다. */
  loading: boolean;
  /** `disabled`와 `loading`이 모두 `false`일 때만 `true`입니다. */
  interactive: boolean;
  /** 누르고 있는 동안 `true`입니다. `interactive`가 아니면 항상 `false`입니다. */
  pressed: boolean;
  /**
   * 버튼 native view에 펼칩니다. 소비자의 `main-thread:bindtouch*`는 view가 아니라 이 훅에 넘겨야
   * 눌림 상태와 합성된 handler로 포함됩니다.
   */
  buttonProps: Required<
    Pick<
      ButtonAccessibilityProps,
      "accessibility-element" | "accessibility-role-description" | "accessibility-traits"
    >
  > &
    Pick<ButtonAccessibilityProps, "accessibility-label"> &
    MainThreadTouchProps & {
      bindtap: UsePressTapReturn["bindtap"];
      bindtouchstart: UsePressTapReturn["bindtouchstart"];
      bindtouchend: UsePressTapReturn["bindtouchend"];
      bindtouchcancel: UsePressTapReturn["bindtouchcancel"];
      "main-thread:bindtap"?: UsePressTapReturn["main-thread:bindtap"];
    };
}

export interface UseQuantityPickerDecrementButtonReturn extends UseQuantityPickerButtonReturn {
  /** Remove 동작으로 전환되었으면 `true`입니다. 이때 `accessibility-label`은 Root의 `removeAccessibilityLabel`입니다. */
  isRemoveButton: boolean;
}

function useQuantityPickerButton(
  props: UseQuantityPickerButtonProps,
  {
    action,
    disabled,
    loading,
    accessibilityLabel,
    isRemoveButton,
  }: {
    action: () => void;
    disabled: boolean;
    loading: boolean;
    accessibilityLabel: string | undefined;
    isRemoveButton: boolean;
  },
): UseQuantityPickerDecrementButtonReturn {
  const {
    bindtap,
    "main-thread:bindtap": mainThreadOnTap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "button",
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
    onTap: (event: TapEvent) => {
      "background only";
      action();
      bindtap?.(event);
    },
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  return useMemo<UseQuantityPickerDecrementButtonReturn>(
    () => ({
      disabled,
      loading,
      interactive,
      pressed,
      isRemoveButton,
      buttonProps: {
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
        "accessibility-label": accessibilityLabel,
        "accessibility-role-description": accessibilityRoleDescription,
        "accessibility-traits": accessibilityTraits,
      },
    }),
    [
      disabled,
      loading,
      interactive,
      pressed,
      isRemoveButton,
      handleTap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      handleMainThreadTap,
      handleMainThreadTouchStart,
      handleMainThreadTouchEnd,
      handleMainThreadTouchCancel,
      accessibilityElement,
      accessibilityLabel,
      accessibilityRoleDescription,
      accessibilityTraits,
    ],
  );
}

/**
 * @platform Lynx
 *
 * `QuantityPickerRoot` 안에서 Decrement 버튼의 tap·눌림 상태·접근성을 연결합니다.
 * 값이 `min`이고 `removable`이면 값을 바꾸지 않고 `onRemove`만 호출합니다.
 */
export function useQuantityPickerDecrementButton(
  props: UseQuantityPickerButtonProps = {},
): UseQuantityPickerDecrementButtonReturn {
  const context = useQuantityPickerContext();
  return useQuantityPickerButton(props, {
    action: context.decrement,
    disabled: context.decrementDisabled,
    loading: context.decrementLoading,
    accessibilityLabel: context.isRemoveButton
      ? context.removeAccessibilityLabel
      : props["accessibility-label"],
    isRemoveButton: context.isRemoveButton,
  });
}

/**
 * @platform Lynx
 *
 * `QuantityPickerRoot` 안에서 Increment 버튼의 tap·눌림 상태·접근성을 연결합니다.
 */
export function useQuantityPickerIncrementButton(
  props: UseQuantityPickerButtonProps = {},
): UseQuantityPickerButtonReturn {
  const context = useQuantityPickerContext();
  return useQuantityPickerButton(props, {
    action: context.increment,
    disabled: context.incrementDisabled,
    loading: context.incrementLoading,
    accessibilityLabel: props["accessibility-label"],
    isRemoveButton: false,
  });
}
