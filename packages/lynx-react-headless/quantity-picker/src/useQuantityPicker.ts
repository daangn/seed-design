import { useCallback, useMemo, type ReactNode } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

type ViewProps = IntrinsicElements["view"];

export type QuantityPickerLoading =
  | boolean
  | {
      decrement?: boolean;
      increment?: boolean;
    };

export type QuantityPickerGetValueText = (valueText: string, value: number | string) => ReactNode;

const defaultGetValueText: QuantityPickerGetValueText = (valueText) => valueText;

export interface UseQuantityPickerBaseProps {
  /** 제어 상태에서 현재 수량을 지정합니다. */
  value?: number;
  /** 비제어 상태에서 초기 수량을 지정합니다. 지정하지 않으면 `min`을 사용합니다. */
  defaultValue?: number;
  /** 수량이 변경될 때 호출됩니다. */
  onValueChange?: (value: number) => void;

  /** 선택할 수 있는 최소 수량입니다. */
  min: number;
  /** 선택할 수 있는 최대 수량입니다. */
  max: number;
  /**
   * 한 번의 조작으로 변경할 수량입니다.
   * @default 1
   */
  step?: number;

  /**
   * 모든 조작을 비활성화합니다.
   * @default false
   */
  disabled?: boolean;
  /**
   * 수량이 유효하지 않은 상태임을 나타냅니다.
   * @default false
   */
  invalid?: boolean;
  /**
   * 값을 표시하되 변경할 수 없도록 합니다.
   * @default false
   */
  readOnly?: boolean;
  /** 전체 또는 특정 action을 loading 상태로 전환하고 해당 조작을 막습니다. */
  loading?: QuantityPickerLoading;

  /** Remove 버튼을 누를 때 호출됩니다. */
  onRemove?: () => void;
  /** 표시할 수량 텍스트를 반환합니다. 단위나 보조 설명을 덧붙일 때 사용합니다. */
  getValueText?: QuantityPickerGetValueText;
  /**
   * 버튼과 값의 배치 방향입니다. `"rtl"`이면 Root가 자식 순서를 뒤집습니다.
   * @default "ltr"
   */
  dir?: "ltr" | "rtl";
}

type QuantityPickerRemovableProps = {
  /** 값이 `min`일 때 Decrement 버튼을 Remove 버튼으로 전환합니다. */
  removable: true;
  /** Remove 버튼의 접근성 이름입니다. Decrement 버튼의 `accessibility-label`을 대신합니다. */
  removeAccessibilityLabel: string;
  onRemove: () => void;
};

type QuantityPickerNonRemovableProps = {
  /**
   * 값이 `min`일 때 Decrement 버튼을 Remove 버튼으로 전환합니다.
   * @default false
   */
  removable?: false;
  /** Remove 버튼의 접근성 이름입니다. */
  removeAccessibilityLabel?: string;
};

export type UseQuantityPickerProps = UseQuantityPickerBaseProps &
  (QuantityPickerRemovableProps | QuantityPickerNonRemovableProps);

export type QuantityPickerRootNativeProps = Required<
  Pick<
    ViewProps,
    "accessibility-element" | "accessibility-role-description" | "accessibility-value"
  >
> &
  Pick<ViewProps, "accessibility-traits">;

export interface UseQuantityPickerReturn {
  value: number;
  min: number;
  max: number;
  step: number;
  dir: "ltr" | "rtl";
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  removable: boolean;
  isAtMin: boolean;
  isAtMax: boolean;
  /** `removable`이고 값이 `min`이면 `true`입니다. Decrement 버튼이 Remove 동작을 합니다. */
  isRemoveButton: boolean;
  removeAccessibilityLabel?: string;
  decrementLoading: boolean;
  incrementLoading: boolean;
  /** `disabled`, `readOnly` 또는 경계(`min`, Remove 전환 제외)로 Decrement를 실행할 수 없으면 `true`입니다. loading은 포함하지 않습니다. */
  decrementDisabled: boolean;
  /** `disabled`, `readOnly` 또는 `max`로 Increment를 실행할 수 없으면 `true`입니다. loading은 포함하지 않습니다. */
  incrementDisabled: boolean;
  getValueText: QuantityPickerGetValueText;
  /** `getValueText(String(value), value)`의 결과입니다. */
  valueText: ReactNode;
  /** 막혀 있지 않으면 `step`만큼 늘리고 `max`에서 멈춥니다. */
  increment: () => void;
  /** 막혀 있지 않으면 `step`만큼 줄이고 `min`에서 멈춥니다. Remove 상태이면 `remove`를 호출합니다. */
  decrement: () => void;
  /** Decrement가 막혀 있지 않으면 값을 바꾸지 않고 `onRemove`만 호출합니다. */
  remove: () => void;
  /** Root native view에 펼치는 접근성 기본값입니다. 뒤에 펼친 props가 덮어씁니다. */
  rootProps: QuantityPickerRootNativeProps;
}

function assertSafeInteger(value: number | undefined, name: string): asserts value is number {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`QuantityPicker: ${name} must be a safe integer.`);
  }
}

function validateProps({
  defaultValue,
  max,
  min,
  step,
  value,
}: Pick<UseQuantityPickerProps, "defaultValue" | "max" | "min" | "step" | "value">) {
  assertSafeInteger(min, "min");
  assertSafeInteger(max, "max");
  assertSafeInteger(step, "step");

  if (min > max) {
    throw new Error("QuantityPicker: min must be less than or equal to max.");
  }
  if (step <= 0) {
    throw new Error("QuantityPicker: step must be greater than 0.");
  }

  for (const [name, candidate] of [
    ["value", value],
    ["defaultValue", defaultValue],
  ] as const) {
    if (candidate === undefined) continue;
    assertSafeInteger(candidate, name);
    if (candidate < min || candidate > max) {
      throw new Error(`QuantityPicker: ${name} must be between min and max.`);
    }
  }
}

function getLoadingState(loading: QuantityPickerLoading | undefined) {
  if (loading === true) return { decrement: true, increment: true };
  return {
    decrement: typeof loading === "object" ? (loading.decrement ?? false) : false,
    increment: typeof loading === "object" ? (loading.increment ?? false) : false,
  };
}

function getAccessibleText(valueText: ReactNode, value: number) {
  return typeof valueText === "string" || typeof valueText === "number"
    ? String(valueText)
    : String(value);
}

/**
 * @platform Lynx
 *
 * QuantityPicker의 수량 범위·제어 상태·Remove·action별 loading 차단과 Root 접근성 기본값을 제공하는 headless 훅입니다.
 * 웹 `@seed-design/react-quantity-picker`와 달리 form 제출 모델이 없어 hidden input을 만들지 않습니다.
 */
export function useQuantityPicker(props: UseQuantityPickerProps): UseQuantityPickerReturn {
  const {
    defaultValue,
    dir = "ltr",
    disabled = false,
    getValueText = defaultGetValueText,
    invalid = false,
    loading,
    max,
    min,
    onRemove,
    onValueChange,
    readOnly = false,
    removeAccessibilityLabel,
    removable = false,
    step = 1,
    value: valueProp,
  } = props;

  validateProps({ defaultValue, max, min, step, value: valueProp });
  const initialValue = defaultValue ?? min;
  assertSafeInteger(initialValue, "defaultValue");
  if (initialValue < min || initialValue > max) {
    throw new Error("QuantityPicker: defaultValue must be between min and max.");
  }

  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: initialValue,
    onChange: onValueChange,
  });

  const loadingState = getLoadingState(loading);
  const isAtMin = value === min;
  const isAtMax = value === max;
  const isRemoveButton = removable && isAtMin;
  const decrementDisabled = disabled || readOnly || (!isRemoveButton && isAtMin);
  const incrementDisabled = disabled || readOnly || isAtMax;
  const decrementBlocked = decrementDisabled || loadingState.decrement;
  const incrementBlocked = incrementDisabled || loadingState.increment;

  const increment = useCallback(() => {
    "background only";
    if (!incrementBlocked) setValue(Math.min(value + step, max));
  }, [incrementBlocked, max, setValue, step, value]);
  const remove = useCallback(() => {
    "background only";
    if (!decrementBlocked) onRemove?.();
  }, [decrementBlocked, onRemove]);
  const decrement = useCallback(() => {
    "background only";
    if (isRemoveButton) {
      remove();
      return;
    }
    if (!decrementBlocked) setValue(Math.max(value - step, min));
  }, [decrementBlocked, isRemoveButton, min, remove, setValue, step, value]);

  const valueText = getValueText(String(value), value);
  const accessibilityValue = getAccessibleText(valueText, value);

  return useMemo<UseQuantityPickerReturn>(
    () => ({
      value,
      min,
      max,
      step,
      dir,
      disabled,
      invalid,
      readOnly,
      removable,
      isAtMin,
      isAtMax,
      isRemoveButton,
      removeAccessibilityLabel,
      decrementLoading: loadingState.decrement,
      incrementLoading: loadingState.increment,
      decrementDisabled,
      incrementDisabled,
      getValueText,
      valueText,
      increment,
      decrement,
      remove,
      rootProps: {
        "accessibility-element": true,
        "accessibility-role-description": "quantity picker",
        "accessibility-traits": disabled ? "disabled" : undefined,
        "accessibility-value": accessibilityValue,
      },
    }),
    [
      value,
      min,
      max,
      step,
      dir,
      disabled,
      invalid,
      readOnly,
      removable,
      isAtMin,
      isAtMax,
      isRemoveButton,
      removeAccessibilityLabel,
      loadingState.decrement,
      loadingState.increment,
      decrementDisabled,
      incrementDisabled,
      getValueText,
      valueText,
      increment,
      decrement,
      remove,
      accessibilityValue,
    ],
  );
}
