import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";

type ViewProps = IntrinsicElements["view"];
type CheckboxAccessibilityProps = Pick<
  ViewProps,
  | "accessibility-element"
  | "accessibility-role-description"
  | "accessibility-traits"
  | "accessibility-value"
>;

export interface UseCheckboxStateProps {
  /** controlled 선택 상태입니다. 지정하면 press는 `onCheckedChange`만 호출합니다. */
  checked?: boolean;

  /**
   * uncontrolled 초기 선택 상태입니다.
   * @default false
   */
  defaultChecked?: boolean;

  onCheckedChange?: (checked: boolean) => void;

  /**
   * 일부만 선택된 상태입니다. press하면 `!checked`로 전이하며, indeterminate 해제는 부모가 맡습니다.
   * @default false
   */
  indeterminate?: boolean;
}

export interface UseCheckboxProps extends UseCheckboxStateProps, CheckboxAccessibilityProps {
  /**
   * `true`이면 press와 `onCheckedChange`가 막히고 `accessibility-traits` 기본값이 `"disabled"`가 됩니다.
   * @default false
   */
  disabled?: boolean;
}

export interface UseCheckboxReturn {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  /** 누르고 있는 동안 `true`입니다. `disabled`이면 항상 `false`입니다. */
  pressed: boolean;
  /** 선택 상태를 바꿉니다. controlled이면 `onCheckedChange`만 호출합니다. */
  setChecked: (checked: boolean) => void;
  /**
   * Root native view에 펼칩니다. 접근성 기본값은 사용자가 전달한 값보다 우선하지 않습니다.
   * `accessibility-value` 기본값은 indeterminate이면 `"mixed"`, 아니면 `"checked"`·`"not checked"`입니다.
   */
  rootProps: CheckboxAccessibilityProps & {
    bindtap: UsePressTapReturn["bindtap"];
    bindtouchstart: UsePressTapReturn["bindtouchstart"];
    bindtouchend: UsePressTapReturn["bindtouchend"];
    bindtouchcancel: UsePressTapReturn["bindtouchcancel"];
  };
}

/**
 * @platform Lynx
 *
 * Checkbox의 선택·indeterminate·disabled 상태, press, 접근성 기본값을 제공하는 headless 훅입니다.
 * 웹 `@seed-design/react-checkbox`와 달리 form 제출 모델이 없어 hidden input을 만들지 않습니다.
 */
export function useCheckbox(props: UseCheckboxProps = {}): UseCheckboxReturn {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    indeterminate = false,
    disabled = false,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "checkbox",
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  } = props;

  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const { pressed, bindtap, bindtouchstart, bindtouchend, bindtouchcancel } = usePressTap({
    disabled,
    onTap: () => {
      "background only";
      setChecked(!checked);
    },
  });

  const resolvedAccessibilityTraits = accessibilityTraits ?? (disabled ? "disabled" : undefined);
  const resolvedAccessibilityValue =
    accessibilityValue ?? (indeterminate ? "mixed" : checked ? "checked" : "not checked");

  return useMemo<UseCheckboxReturn>(
    () => ({
      checked,
      indeterminate,
      disabled,
      pressed,
      setChecked,
      rootProps: {
        bindtap,
        bindtouchstart,
        bindtouchend,
        bindtouchcancel,
        "accessibility-element": accessibilityElement,
        "accessibility-role-description": accessibilityRoleDescription,
        "accessibility-traits": resolvedAccessibilityTraits,
        "accessibility-value": resolvedAccessibilityValue,
      },
    }),
    [
      checked,
      indeterminate,
      disabled,
      pressed,
      setChecked,
      bindtap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      accessibilityElement,
      accessibilityRoleDescription,
      resolvedAccessibilityTraits,
      resolvedAccessibilityValue,
    ],
  );
}
