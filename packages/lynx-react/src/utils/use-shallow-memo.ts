import { useRef } from "@lynx-js/react";

export function useShallowMemo<T extends object | undefined>(value: T): T {
  const ref = useRef(value);
  const previous = ref.current;
  if (previous === value) return previous;

  if (
    previous !== undefined &&
    value !== undefined &&
    Object.keys(previous).length === Object.keys(value).length &&
    Object.keys(value).every(
      (key) =>
        Object.prototype.hasOwnProperty.call(previous, key) &&
        Object.is(Reflect.get(previous, key), Reflect.get(value, key)),
    )
  ) {
    return previous;
  }

  ref.current = value;
  return value;
}
