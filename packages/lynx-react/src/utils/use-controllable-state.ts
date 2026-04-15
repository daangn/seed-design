import { useState } from "@lynx-js/react";
import { useMemoizedFn } from "@lynx-js/lynx-ui-common";

export interface UseControllableStateProps<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * Controlled/uncontrolled state pattern for Lynx components.
 *
 * - When `value` is provided, the component is controlled.
 * - When `value` is `undefined`, the component manages its own state
 *   starting from `defaultValue`.
 * - `onChange` fires in both modes.
 */
export function useControllableState<T>(
  props: UseControllableStateProps<T>,
): [T, (value: T) => void] {
  const { value, defaultValue, onChange } = props;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;

  const setValue = useMemoizedFn((nextValue: T) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    if (nextValue !== currentValue) {
      onChange?.(nextValue);
    }
  });

  return [currentValue, setValue];
}
