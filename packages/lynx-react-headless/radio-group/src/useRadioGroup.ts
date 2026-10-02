import { useMemo } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

type ViewProps = IntrinsicElements["view"];
type RootAccessibilityProps = Pick<
  ViewProps,
  "accessibility-element" | "accessibility-role-description" | "accessibility-traits"
>;

export interface UseRadioGroupStateProps {
  /** controlled 선택 값입니다. 지정하면 Item 선택은 `onValueChange`만 호출합니다. */
  value?: string;

  /** uncontrolled 초기 선택 값입니다. */
  defaultValue?: string;

  onValueChange?: (value: string) => void;
}

export interface UseRadioGroupProps extends UseRadioGroupStateProps, RootAccessibilityProps {
  /**
   * `true`이면 모든 Item의 press·사용자 tap handler·선택 변경이 막히고
   * Root `accessibility-traits` 기본값이 `"disabled"`가 됩니다.
   * @default false
   */
  disabled?: boolean;

  /**
   * 선택 값이 유효하지 않은 상태입니다. Lynx에는 대응하는 접근성 속성이 없어
   * native 속성으로 만들지 않고 context로만 제공합니다.
   * @default false
   */
  invalid?: boolean;
}

export interface UseRadioGroupReturn {
  value: string | undefined;
  /** 선택 값을 바꿉니다. controlled이면 `onValueChange`만 호출합니다. disabled를 검사하지 않습니다. */
  setValue: (value: string) => void;
  disabled: boolean;
  invalid: boolean;
  /**
   * Root native view에 펼칩니다. 접근성 기본값은 사용자가 전달한 값보다 우선하지 않습니다.
   * `accessibility-traits` 기본값은 disabled이면 `"disabled"`입니다.
   */
  rootProps: Required<Pick<ViewProps, "accessibility-element" | "accessibility-role-description">> &
    Pick<ViewProps, "accessibility-traits">;
}

/**
 * @platform Lynx
 *
 * RadioGroup의 단일 선택 값, disabled·invalid 상태, Root 접근성 기본값을 제공하는 headless 훅입니다.
 *
 * 웹 `@seed-design/react-radio-group`과의 차이:
 * - native form 제출 모델이 없어 `name`·`form`과 hidden input이 없습니다.
 * - DOM id 기반 label·description 연결과 hover·focus 상태가 없습니다.
 */
export function useRadioGroup(props: UseRadioGroupProps = {}): UseRadioGroupReturn {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled = false,
    invalid = false,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "radiogroup",
    "accessibility-traits": accessibilityTraits,
  } = props;
  const [value, setValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
    onChange(nextValue) {
      "background only";
      if (nextValue !== undefined) onValueChange?.(nextValue);
    },
  });
  const resolvedAccessibilityTraits = accessibilityTraits ?? (disabled ? "disabled" : undefined);

  return useMemo<UseRadioGroupReturn>(
    () => ({
      value,
      setValue,
      disabled,
      invalid,
      rootProps: {
        "accessibility-element": accessibilityElement,
        "accessibility-role-description": accessibilityRoleDescription,
        "accessibility-traits": resolvedAccessibilityTraits,
      },
    }),
    [
      value,
      setValue,
      disabled,
      invalid,
      accessibilityElement,
      accessibilityRoleDescription,
      resolvedAccessibilityTraits,
    ],
  );
}
