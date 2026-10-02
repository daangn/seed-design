import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";
import { useRadioGroupContext } from "./useRadioGroupContext.js";

type ViewProps = IntrinsicElements["view"];
type TapEvent = Parameters<NonNullable<ViewProps["bindtap"]>>[0];
type ItemAccessibilityProps = Pick<
  ViewProps,
  | "accessibility-element"
  | "accessibility-role-description"
  | "accessibility-traits"
  | "accessibility-value"
>;

export interface UseRadioGroupItemProps
  extends ItemAccessibilityProps,
    Pick<
      ViewProps,
      "main-thread:bindtouchstart" | "main-thread:bindtouchend" | "main-thread:bindtouchcancel"
    > {
  value: string;

  /**
   * `true`이면 이 Item의 press, 사용자 tap handler, 선택 변경이 막힙니다. Root가 disabled여도 막힙니다.
   * @default false
   */
  disabled?: boolean;

  /** 사용자 tap handler입니다. disabled가 아니면 선택 변경 전에 실행됩니다. */
  bindtap?: ViewProps["bindtap"];

  /** disabled가 아닐 때만 `itemProps`에 포함됩니다. */
  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
}

export type RadioGroupItemNativeProps = Required<
  Pick<
    ViewProps,
    "accessibility-element" | "accessibility-role-description" | "accessibility-value"
  >
> &
  Pick<ViewProps, "accessibility-traits"> &
  Omit<UsePressTapReturn, "pressed">;

export interface UseRadioGroupItemReturn {
  value: string;
  checked: boolean;
  /** Root 또는 Item이 disabled이면 `true`입니다. */
  disabled: boolean;
  /** 누르고 있는 동안 `true`입니다. `disabled`이면 항상 `false`입니다. */
  pressed: boolean;
  /**
   * Item native view에 펼칩니다. 접근성 기본값은 사용자가 전달한 값보다 우선하지 않습니다.
   * `accessibility-traits` 기본값은 disabled이면 `"disabled"`, `accessibility-value` 기본값은
   * `"selected"`·`"not selected"`입니다.
   */
  itemProps: RadioGroupItemNativeProps;
}

/**
 * @platform Lynx
 *
 * `RadioGroupRoot` 안에서 Item의 선택·disabled·press·접근성 기본값을 제공하는 headless 훅입니다.
 * 이미 선택된 Item을 다시 눌러도 선택을 해제하지 않습니다.
 *
 * 웹 `@seed-design/react-radio-group`의 `getItemProps`와 달리 press 상태를 위해 훅으로 제공합니다.
 */
export function useRadioGroupItem(props: UseRadioGroupItemProps): UseRadioGroupItemReturn {
  const {
    value,
    disabled: itemDisabled = false,
    bindtap,
    "main-thread:bindtap": mainThreadOnTap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "radio",
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  } = props;
  const root = useRadioGroupContext();
  const disabled = root.disabled || itemDisabled;
  const checked = root.value === value;
  const { setValue } = root;

  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: (event: TapEvent) => {
      "background only";
      bindtap?.(event);
      if (!checked) setValue(value);
    },
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });

  const {
    bindtap: handleTap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
  } = pressHandlers;
  const resolvedAccessibilityTraits = accessibilityTraits ?? (disabled ? "disabled" : undefined);
  const resolvedAccessibilityValue = accessibilityValue ?? (checked ? "selected" : "not selected");

  return useMemo<UseRadioGroupItemReturn>(
    () => ({
      value,
      checked,
      disabled,
      pressed,
      itemProps: {
        bindtap: handleTap,
        bindtouchstart,
        bindtouchend,
        bindtouchcancel,
        ...(mainThreadBindtap ? { "main-thread:bindtap": mainThreadBindtap } : {}),
        ...(mainThreadBindtouchstart
          ? { "main-thread:bindtouchstart": mainThreadBindtouchstart }
          : {}),
        ...(mainThreadBindtouchend ? { "main-thread:bindtouchend": mainThreadBindtouchend } : {}),
        ...(mainThreadBindtouchcancel
          ? { "main-thread:bindtouchcancel": mainThreadBindtouchcancel }
          : {}),
        "accessibility-element": accessibilityElement,
        "accessibility-role-description": accessibilityRoleDescription,
        "accessibility-traits": resolvedAccessibilityTraits,
        "accessibility-value": resolvedAccessibilityValue,
      },
    }),
    [
      value,
      checked,
      disabled,
      pressed,
      handleTap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      mainThreadBindtap,
      mainThreadBindtouchstart,
      mainThreadBindtouchend,
      mainThreadBindtouchcancel,
      accessibilityElement,
      accessibilityRoleDescription,
      resolvedAccessibilityTraits,
      resolvedAccessibilityValue,
    ],
  );
}
