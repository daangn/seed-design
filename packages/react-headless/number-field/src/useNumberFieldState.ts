import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";

export interface UseNumberFieldStateProps {
  /**
   * The value of the number field.
   */
  value?: number;

  /**
   * The default value of the number field.
   */
  defaultValue?: number;

  /**
   * The callback function to call when the value changes.
   */
  onValueChange?: (value: number | undefined) => void;

  /**
   * The minimum value of the number field.
   * @default Number.NEGATIVE_INFINITY
   */
  min?: number;

  /**
   * The maximum value of the number field.
   * @default Number.POSITIVE_INFINITY
   */
  max?: number;

  /**
   * The step value of the number field.
   * @default 1
   */
  step?: number;

  /**
   * The number of decimal places to format the value.
   * @default undefined
   */
  formatOptions?: Intl.NumberFormatOptions;

  /**
   * The locale to use for formatting.
   * @default undefined
   */
  locale?: string;
}

/**
 * Clamps a number between a minimum and maximum value.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to a specific number of decimal places based on step.
 */
function roundToStep(value: number, step: number): number {
  const precision = step.toString().split(".")[1]?.length ?? 0;
  return Number(value.toFixed(precision));
}

/**
 * Parses a string to a number, handling locales and formatting.
 */
function parseNumber(value: string, locale?: string): number | undefined {
  // Remove all whitespace
  let normalized = value.trim();

  if (normalized === "" || normalized === "-") {
    return undefined;
  }

  // Handle locale-specific decimal separators
  if (locale) {
    const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
    const decimalSeparator = parts.find((part) => part.type === "decimal")?.value ?? ".";
    const groupSeparator = parts.find((part) => part.type === "group")?.value;

    // Remove group separators
    if (groupSeparator) {
      normalized = normalized.replaceAll(groupSeparator, "");
    }

    // Replace locale decimal separator with standard dot
    if (decimalSeparator !== ".") {
      normalized = normalized.replace(decimalSeparator, ".");
    }
  }

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * Formats a number according to locale and format options.
 */
function formatNumber(
  value: number | undefined,
  locale?: string,
  formatOptions?: Intl.NumberFormatOptions,
): string {
  if (value === undefined) {
    return "";
  }

  if (locale || formatOptions) {
    return new Intl.NumberFormat(locale, formatOptions).format(value);
  }

  return String(value);
}

export function useNumberFieldState({
  value: __value,
  defaultValue,
  onValueChange: __onValueChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  formatOptions,
  locale,
}: UseNumberFieldStateProps) {
  const onValueChange = useCallbackRef(__onValueChange);

  const [value, setValue] = useControllableState({
    prop: __value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const [inputValue, setInputValue] = useState<string>(() =>
    formatNumber(value, locale, formatOptions),
  );

  // Track previous value to detect external changes (controlled mode)
  const prevValueRef = React.useRef<number | undefined>(value);
  useEffect(() => {
    // Only update inputValue if value changed externally (not from our own updates)
    if (prevValueRef.current !== value && value !== undefined) {
      setInputValue(formatNumber(value, locale, formatOptions));
      prevValueRef.current = value;
    }
  }, [value, locale, formatOptions]);

  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const [isLabelRendered, setIsLabelRendered] = useState(false);
  const labelRef = useCallback((node: HTMLLabelElement | null) => {
    setIsLabelRendered(!!node);
  }, []);

  const [isDescriptionRendered, setIsDescriptionRendered] = useState(false);
  const descriptionRef = useCallback((node: HTMLElement | null) => {
    setIsDescriptionRendered(!!node);
  }, []);

  const [isErrorMessageRendered, setIsErrorMessageRendered] = useState(false);
  const errorMessageRef = useCallback((node: HTMLElement | null) => {
    setIsErrorMessageRendered(!!node);
  }, []);

  const clampValue = useCallback(
    (val: number | undefined): number | undefined => {
      if (val === undefined) return undefined;
      const clamped = clamp(val, min, max);
      return roundToStep(clamped, step);
    },
    [min, max, step],
  );

  const increment = useCallback(() => {
    const currentValue = value ?? 0;
    const newValue = clampValue(currentValue + step);
    prevValueRef.current = newValue;
    setValue(newValue);
    if (newValue !== undefined) {
      setInputValue(formatNumber(newValue, locale, formatOptions));
    }
  }, [value, step, clampValue, setValue, locale, formatOptions]);

  const decrement = useCallback(() => {
    const currentValue = value ?? 0;
    const newValue = clampValue(currentValue - step);
    prevValueRef.current = newValue;
    setValue(newValue);
    if (newValue !== undefined) {
      setInputValue(formatNumber(newValue, locale, formatOptions));
    }
  }, [value, step, clampValue, setValue, locale, formatOptions]);

  const setValueFromInput = useCallback(
    (input: string) => {
      setInputValue(input);
      // Parse while typing to update the numeric value
      const parsed = parseNumber(input, locale);
      const clamped = clampValue(parsed);
      prevValueRef.current = clamped;
      setValue(clamped);
    },
    [locale, clampValue, setValue],
  );

  const commitValue = useCallback(() => {
    // On blur, format the value properly
    if (value !== undefined) {
      prevValueRef.current = value;
      setInputValue(formatNumber(value, locale, formatOptions));
    } else {
      prevValueRef.current = undefined;
      setInputValue("");
    }
  }, [value, locale, formatOptions]);

  const setToMin = useCallback(() => {
    if (min !== undefined && min !== Number.NEGATIVE_INFINITY) {
      prevValueRef.current = min;
      setValue(min);
      setInputValue(formatNumber(min, locale, formatOptions));
    }
  }, [min, setValue, locale, formatOptions]);

  const setToMax = useCallback(() => {
    if (max !== undefined && max !== Number.POSITIVE_INFINITY) {
      prevValueRef.current = max;
      setValue(max);
      setInputValue(formatNumber(max, locale, formatOptions));
    }
  }, [max, setValue, locale, formatOptions]);

  const canIncrement = value === undefined || value < max;
  const canDecrement = value === undefined || value > min;
  const hasMin = min !== undefined && min !== Number.NEGATIVE_INFINITY;
  const hasMax = max !== undefined && max !== Number.POSITIVE_INFINITY;

  return {
    refs: {
      label: labelRef,
      description: descriptionRef,
      errorMessage: errorMessageRef,
    },

    value,
    inputValue,
    isHovered,
    isActive,
    isFocused,
    isFocusVisible,
    canIncrement,
    canDecrement,
    hasMin,
    hasMax,
    renderedElements: {
      label: isLabelRendered,
      description: isDescriptionRendered,
      errorMessage: isErrorMessageRendered,
    },

    setValue,
    setInputValue: setValueFromInput,
    increment,
    decrement,
    commitValue,
    setToMin,
    setToMax,
    setIsHovered,
    setIsActive,
    setIsFocused,
    setIsFocusVisible,
  };
}
