import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type ProviderProps,
  type ReactElement,
} from "@lynx-js/react";
import type { UseSegmentedControlReturn } from "./useSegmentedControl.js";

export interface UseSegmentedControlContext extends UseSegmentedControlReturn {}

const SegmentedControlContext = createContext<UseSegmentedControlContext | null>(null);

type ItemDependencies = Pick<
  UseSegmentedControlContext,
  "value" | "disabled" | "registerItem" | "setValue"
>;

const ItemDependenciesContext = createContext<ItemDependencies | null>(null);

export function SegmentedControlProvider({
  value,
  children,
}: ProviderProps<UseSegmentedControlContext | null>): ReactElement {
  return createElement(
    SegmentedControlContext.Provider,
    { value },
    value
      ? createElement(ItemDependenciesProvider, { value }, children)
      : createElement(ItemDependenciesContext.Provider, { value: null }, children),
  );
}

function ItemDependenciesProvider({ value, children }: ProviderProps<UseSegmentedControlContext>) {
  const { value: selected, disabled, registerItem, setValue } = value;
  const dependencies = useMemo(
    () => ({ value: selected, disabled, registerItem, setValue }),
    [selected, disabled, registerItem, setValue],
  );
  return createElement(ItemDependenciesContext.Provider, { value: dependencies }, children);
}

export function useSegmentedControlItemDependencies(): ItemDependencies {
  const context = useContext(ItemDependenciesContext);
  if (!context)
    throw new Error("useSegmentedControlContext must be used within a SegmentedControlRoot");
  return context;
}

/**
 * `SegmentedControlRoot`가 내려준 `useSegmentedControl` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useSegmentedControlContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSegmentedControlContext | null : UseSegmentedControlContext {
  const context = useContext(SegmentedControlContext);
  if (!context && strict) {
    throw new Error("useSegmentedControlContext must be used within a SegmentedControlRoot");
  }
  return context as UseSegmentedControlContext;
}
