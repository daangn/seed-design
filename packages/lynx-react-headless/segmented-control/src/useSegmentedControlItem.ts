import { useEffect, useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";
import { useSegmentedControlContext } from "./useSegmentedControlContext.js";

type ViewProps = IntrinsicElements["view"];
type TapEvent = Parameters<NonNullable<ViewProps["bindtap"]>>[0];
type ItemAccessibilityProps = Pick<
  ViewProps,
  "accessibility-element" | "accessibility-role-description" | "accessibility-traits"
>;

export interface UseSegmentedControlItemProps
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

  /** 사용자 tap handler입니다. disabled가 아니면 선택 변경 다음에 실행됩니다. */
  bindtap?: ViewProps["bindtap"];

  /** disabled가 아닐 때만 `itemProps`에 포함됩니다. */
  "main-thread:bindtap"?: ViewProps["main-thread:bindtap"];
}

export type SegmentedControlItemNativeProps = Required<
  Pick<ViewProps, "accessibility-element" | "accessibility-role-description">
> &
  Pick<ViewProps, "accessibility-traits" | "accessibility-value"> &
  Omit<UsePressTapReturn, "pressed">;

export interface UseSegmentedControlItemReturn {
  value: string;
  checked: boolean;
  /** Root 또는 Item이 disabled이면 `true`입니다. */
  disabled: boolean;
  /** 누르고 있는 동안 `true`입니다. `disabled`이면 항상 `false`입니다. */
  pressed: boolean;
  /**
   * Item native view에 펼칩니다. `accessibility-traits`는 disabled이면 `"disabled"`, 선택되면
   * `"selected"`이고, 그 밖에는 전달한 값(기본 `"button"`)입니다. `accessibility-value`는
   * `"selected"`·`"not selected"`입니다. 소비자의 `main-thread:bindtouch*`는 이 훅에 넘겨야
   * 눌림 상태와 합성된 handler로 포함됩니다.
   */
  itemProps: SegmentedControlItemNativeProps;
}

/**
 * @platform Lynx
 *
 * `SegmentedControlRoot` 안에서 Item을 등록하고 선택·disabled·press·접근성 기본값을 제공하는 headless 훅입니다.
 * 마운트할 때 값을 Root에 등록하고 언마운트할 때 해제합니다.
 */
export function useSegmentedControlItem(
  props: UseSegmentedControlItemProps,
): UseSegmentedControlItemReturn {
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
  } = props;
  const root = useSegmentedControlContext();
  const disabled = root.disabled || itemDisabled;
  const checked = root.value === value;
  const { registerItem, setValue } = root;

  useEffect(() => {
    "background only";
    return registerItem(value);
  }, [registerItem, value]);

  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: (event: TapEvent) => {
      "background only";
      if (!checked) setValue(value);
      bindtap?.(event);
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
  const resolvedAccessibilityTraits = disabled
    ? "disabled"
    : checked
      ? "selected"
      : (accessibilityTraits ?? "button");

  return useMemo<UseSegmentedControlItemReturn>(
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
        "accessibility-value": checked ? "selected" : "not selected",
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
    ],
  );
}
