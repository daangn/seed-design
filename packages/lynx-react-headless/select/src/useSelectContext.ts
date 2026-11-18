import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "@lynx-js/react";
import type { UseSelectReturn } from "./useSelect.js";

export interface UseSelectContext extends UseSelectReturn {}

/** 항목이 읽는 값입니다. 열림·위치 상태가 바뀌어도 그대로라 항목이 다시 렌더링되지 않습니다. */
export type SelectItemsContextValue = Pick<
  UseSelectReturn,
  "value" | "disabled" | "readOnly" | "selectValue" | "registerItem" | "unregisterItem"
>;

const SelectContext = createContext<UseSelectContext | null>(null);
const SelectItemsContext = createContext<SelectItemsContextValue | null>(null);

export interface SelectProviderProps {
  value: UseSelectContext;
  children?: ReactNode;
}

/**
 * `useSelect` 결과를 하위 요소에 전달합니다. 항목에는 열림·위치 상태를 뺀 값을 따로 전달합니다. 열 때마다 모든
 * 항목이 다시 렌더링되면 ReactLynx commit(`rLynxChange`)이 항목 수에 비례해 늘어납니다.
 */
export function SelectProvider({ value, children }: SelectProviderProps): ReactElement {
  const {
    value: selectedValue,
    disabled,
    readOnly,
    selectValue,
    registerItem,
    unregisterItem,
  } = value;
  const items = useMemo<SelectItemsContextValue>(
    () => ({ value: selectedValue, disabled, readOnly, selectValue, registerItem, unregisterItem }),
    [selectedValue, disabled, readOnly, selectValue, registerItem, unregisterItem],
  );
  return createElement(
    SelectContext.Provider,
    { value },
    createElement(SelectItemsContext.Provider, { value: items }, children),
  );
}

/**
 * SelectRoot가 내려준 `useSelect` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useSelectContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseSelectContext | null : UseSelectContext {
  const context = useContext(SelectContext);
  if (!context && strict) {
    throw new Error("useSelectContext must be used within a SelectRoot");
  }
  return context as UseSelectContext;
}

/** 항목이 읽는 값입니다. SelectRoot 밖에서 쓰면 throw합니다. */
export function useSelectItemsContext(): SelectItemsContextValue {
  const context = useContext(SelectItemsContext);
  if (!context) throw new Error("useSelectItemsContext must be used within a SelectRoot");
  return context;
}
