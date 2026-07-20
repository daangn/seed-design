import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ariaAttr, buttonProps, dataAttr, elementProps, inputProps } from "@seed-design/dom-utils";
import { useCallback } from "react";

export type QuantityPickerLoading =
  | boolean
  | {
      decrement?: boolean;
      increment?: boolean;
    };

export type QuantityPickerGetValueText = (value: number) => string;

export interface UseQuantityPickerProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;

  min: number;
  max: number;
  /**
   * @default 1
   */
  step?: number;

  /**
   * @default false
   */
  disabled?: boolean;
  /**
   * @default false
   */
  invalid?: boolean;
  /**
   * @default false
   */
  readOnly?: boolean;
  /**
   * @default false
   */
  removable?: boolean;
  loading?: QuantityPickerLoading;

  removeAriaLabel?: string;
  onRemove?: () => void;
  getValueText?: QuantityPickerGetValueText;
  /**
   * @default "ltr"
   */
  dir?: "ltr" | "rtl";
}

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
    getValueText = String,
    invalid = false,
    loading,
    max,
    min,
    onRemove,
    onValueChange,
    readOnly = false,
    removable = false,
    step = 1,
    value: propValue,
  } = props;

  validateProps({ ...props, step });

  const initialValue = defaultValue ?? 1;
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
      "aria-label": isRemoveButton ? props.removeAriaLabel : undefined,
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
      children: getValueText(value),
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
