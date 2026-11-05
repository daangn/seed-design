import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, buttonProps, dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";
import { useCallback, type ReactNode } from "react";

export type QuantityPickerLoading =
  | boolean
  | {
      decrement?: boolean;
      increment?: boolean;
    };

export type QuantityPickerGetValueText = (valueText: string, value: number | string) => ReactNode;

const defaultGetValueText: QuantityPickerGetValueText = (valueText) => valueText;

interface UseQuantityPickerBaseProps {
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
   * 버튼과 값의 배치 방향입니다.
   * @default "ltr"
   */
  dir?: "ltr" | "rtl";
}

type QuantityPickerRemovableProps = {
  /** 값이 `min`일 때 Decrement 버튼을 Remove 버튼으로 전환합니다. */
  removable: true;
  /** Remove 버튼의 접근성 이름입니다. */
  removeAriaLabel: string;
};

type QuantityPickerNonRemovableProps = {
  /**
   * 값이 `min`일 때 Decrement 버튼을 Remove 버튼으로 전환합니다.
   * @default false
   */
  removable?: false;
  /** Remove 버튼의 접근성 이름입니다. */
  removeAriaLabel?: string;
};

export type UseQuantityPickerProps = UseQuantityPickerBaseProps &
  (QuantityPickerRemovableProps | QuantityPickerNonRemovableProps);

export type UseQuantityPickerReturn = ReturnType<typeof useQuantityPicker>;

function assertSafeInteger(value: number | undefined, name: string): asserts value is number {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`QuantityPicker: ${name} must be a safe integer.`);
  }
}

function validateProps({ defaultValue, max, min, step, value }: UseQuantityPickerProps) {
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
  if (loading === true) {
    return { decrement: true, increment: true };
  }

  return {
    decrement: typeof loading === "object" ? (loading.decrement ?? false) : false,
    increment: typeof loading === "object" ? (loading.increment ?? false) : false,
  };
}

export function useQuantityPicker(props: UseQuantityPickerProps) {
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
    removeAriaLabel,
    removable = false,
    step = 1,
    value: propValue,
  } = props;

  validateProps({ ...props, step });

  const initialValue = defaultValue ?? min;
  assertSafeInteger(initialValue, "defaultValue");
  if (initialValue < min || initialValue > max) {
    throw new Error("QuantityPicker: defaultValue must be between min and max.");
  }

  const [value, setValue] = useControllableState({
    prop: propValue,
    defaultProp: initialValue,
    onChange: onValueChange,
  });

  const isAtMin = value === min;
  const isAtMax = value === max;
  const isRemoveButton = removable && isAtMin;
  const loadingState = getLoadingState(loading);

  const decrementDisabled = disabled || (!isRemoveButton && isAtMin);
  const incrementDisabled = disabled || isAtMax;
  const decrementBlocked = decrementDisabled || readOnly || loadingState.decrement;
  const incrementBlocked = incrementDisabled || readOnly || loadingState.increment;

  const increment = useCallback(() => {
    if (incrementBlocked) return;

    setValue(Math.min(value + step, max));
  }, [incrementBlocked, max, setValue, step, value]);

  const remove = useCallback(() => {
    if (decrementBlocked) return;

    onRemove?.();
  }, [decrementBlocked, onRemove]);

  const decrement = useCallback(() => {
    if (isRemoveButton) {
      remove();
      return;
    }
    if (decrementBlocked) return;

    setValue(Math.max(value - step, min));
  }, [decrementBlocked, isRemoveButton, min, remove, setValue, step, value]);

  const stateProps = elementProps({
    "data-disabled": dataAttr(disabled),
    "data-invalid": dataAttr(invalid),
    "data-loading": dataAttr(loadingState.decrement || loadingState.increment),
    "data-max": dataAttr(isAtMax),
    "data-min": dataAttr(isAtMin),
    "data-readonly": dataAttr(readOnly),
  });

  return {
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
    decrementLoading: loadingState.decrement,
    incrementLoading: loadingState.increment,
    decrementDisabled: decrementDisabled || readOnly,
    incrementDisabled: incrementDisabled || readOnly,

    increment,
    decrement,
    remove,
    stateProps,
    getValueText,

    rootProps: elementProps({
      ...stateProps,
      role: "group",
      dir,
      "aria-disabled": ariaAttr(disabled),
    }),
    decrementButtonProps: buttonProps({
      ...stateProps,
      type: "button",
      disabled: decrementDisabled,
      "aria-busy": ariaAttr(loadingState.decrement),
      "aria-disabled": ariaAttr(decrementBlocked),
      "aria-label": isRemoveButton ? removeAriaLabel : undefined,
      "data-disabled": dataAttr(decrementDisabled || readOnly),
      "data-loading": dataAttr(loadingState.decrement),
      "data-remove": dataAttr(isRemoveButton),
      onClick(event) {
        if (event.defaultPrevented) return;
        decrement();
      },
    }),
    incrementButtonProps: buttonProps({
      ...stateProps,
      type: "button",
      disabled: incrementDisabled,
      "aria-busy": ariaAttr(loadingState.increment),
      "aria-disabled": ariaAttr(incrementBlocked),
      "data-disabled": dataAttr(incrementDisabled || readOnly),
      "data-loading": dataAttr(loadingState.increment),
      onClick(event) {
        if (event.defaultPrevented) return;
        increment();
      },
    }),
    decrementIconProps: {
      "data-disabled": dataAttr(decrementDisabled || readOnly),
    },
    incrementIconProps: {
      "data-disabled": dataAttr(incrementDisabled || readOnly),
    },
    valueDisplayProps: elementProps({
      ...stateProps,
      "aria-atomic": "true",
      "aria-live": "polite",
      children: getValueText(String(value), value),
    }),
    hiddenInputProps: inputProps({
      ...stateProps,
      type: "hidden",
      value: String(value),
      disabled,
      readOnly,
    }),
  };
}
