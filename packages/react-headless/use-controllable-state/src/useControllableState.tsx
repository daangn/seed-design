// This code includes portions derived from radix-ui/primitives (https://github.com/radix-ui/primitives)
// Used under the MIT License: https://opensource.org/licenses/MIT

import * as React from "react";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";

// Prevent bundlers from trying to optimize the import
const useInsertionEffect: typeof useLayoutEffect =
  // biome-ignore lint/suspicious/noExplicitAny: React internal API access
  (React as any)[" useInsertionEffect ".trim().toString()] || useLayoutEffect;

export type ChangeHandler<T, M = undefined> = (state: T, details?: M) => void;
export type SetStateFn<T, M = undefined> = (value: T | ((prev: T) => T), details?: M) => void;

export interface UseControllableStateParams<T, M = undefined> {
  prop?: T | undefined;
  defaultProp: T;
  onChange?: ChangeHandler<T, M>;
  caller?: string;
}

export function useControllableState<T, M = undefined>({
  prop,
  defaultProp,
  onChange = () => {},
  caller,
}: UseControllableStateParams<T, M>): [T, SetStateFn<T, M>] {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef, detailsRef] = useUncontrolledState<
    T,
    M
  >({
    defaultProp,
    onChange,
  });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;

  // @ts-expect-error
  if (process.env.NODE_ENV !== "production") {
    // biome-ignore lint/correctness/useHookAtTopLevel: OK to disable conditionally calling hooks here because they will always run consistently in the same environment. Bundlers should be able to remove the code block entirely in production.
    const isControlledRef = React.useRef(prop !== undefined);

    // biome-ignore lint/correctness/useHookAtTopLevel: same
    React.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }

  const setValue = React.useCallback<SetStateFn<T, M>>(
    (nextValue, details) => {
      if (isControlled) {
        const value = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (value !== prop) {
          onChangeRef.current?.(value, details);
        }
      } else {
        detailsRef.current = details;
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef, detailsRef],
  );

  return [value, setValue];
}

function useUncontrolledState<T, M = undefined>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T, M>, "prop" | "caller">): [
  value: T,
  setValue: React.Dispatch<React.SetStateAction<T>>,
  onChangeRef: React.RefObject<ChangeHandler<T, M> | undefined>,
  detailsRef: React.RefObject<M | undefined>,
] {
  const [value, setValue] = React.useState(defaultProp);
  const prevValueRef = React.useRef(value);
  const detailsRef = React.useRef<M | undefined>(undefined);

  const onChangeRef = React.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value, detailsRef.current);
      prevValueRef.current = value;
      detailsRef.current = undefined;
    }
  }, [value]);

  return [value, setValue, onChangeRef, detailsRef];
}

// biome-ignore lint/suspicious/noExplicitAny: type guard utility
function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === "function";
}
