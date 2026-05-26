import { useRef, useState } from "@lynx-js/react";

export interface UseControllableStateProps<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>(
  props: UseControllableStateProps<T>,
): [T, (value: T) => void] {
  const { value, defaultValue, onChange } = props;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;
  const prevValueRef = useRef(currentValue);

  prevValueRef.current = currentValue;

  const setValue = (nextValue: T) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    if (nextValue !== prevValueRef.current) {
      onChange?.(nextValue);
      prevValueRef.current = nextValue;
    }
  };

  return [currentValue, setValue];
}
