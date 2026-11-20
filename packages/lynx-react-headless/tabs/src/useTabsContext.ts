import {
  createContext,
  createElement,
  useContext,
  useMemo,
  type ProviderProps,
  type ReactElement,
} from "@lynx-js/react";
import type { UseTabsReturn } from "./useTabs.js";

export interface UseTabsContext extends UseTabsReturn {}

const TabsContext = createContext<UseTabsContext | null>(null);

type TriggerContextValue = Pick<
  UseTabsContext,
  | "value"
  | "visualValue"
  | "registerTrigger"
  | "updateTriggerDisabled"
  | "updateTriggerWidth"
  | "selectValue"
>;

const TriggerContext = createContext<TriggerContextValue | null>(null);

export function TabsProvider({
  value,
  children,
}: ProviderProps<UseTabsContext | null>): ReactElement {
  return createElement(
    TabsContext.Provider,
    { value },
    value
      ? createElement(TabsTriggerStateProvider, { value }, children)
      : createElement(TriggerContext.Provider, { value: null }, children),
  );
}

function TabsTriggerStateProvider({ value, children }: ProviderProps<UseTabsContext>) {
  const {
    value: selectedValue,
    visualValue,
    registerTrigger,
    updateTriggerDisabled,
    updateTriggerWidth,
    selectValue,
  } = value;
  const trigger = useMemo<TriggerContextValue>(
    () => ({
      value: selectedValue,
      visualValue,
      registerTrigger,
      updateTriggerDisabled,
      updateTriggerWidth,
      selectValue,
    }),
    [
      selectedValue,
      visualValue,
      registerTrigger,
      updateTriggerDisabled,
      updateTriggerWidth,
      selectValue,
    ],
  );
  return createElement(TriggerContext.Provider, { value: trigger }, children);
}

export function useTabsTriggerState(): TriggerContextValue {
  const context = useContext(TriggerContext);
  if (!context) throw new Error("useTabsTriggerState must be used within a Tabs");
  return context;
}

/**
 * `TabsRoot`가 내려준 `useTabs` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useTabsContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseTabsContext | null : UseTabsContext {
  const context = useContext(TabsContext);
  if (!context && strict) {
    throw new Error("useTabsContext must be used within a Tabs");
  }
  return context as UseTabsContext;
}
