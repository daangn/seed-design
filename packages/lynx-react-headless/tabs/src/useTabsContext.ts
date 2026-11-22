import {
  createContext,
  createElement,
  memo,
  useContext,
  useMemo,
  type Provider,
  type ProviderProps,
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

export const TabsProvider: Provider<UseTabsContext | null> = memo(function TabsProvider({
  value,
  children,
}: ProviderProps<UseTabsContext | null>) {
  return createElement(
    TabsContext.Provider,
    { value },
    createElement(TabsTriggerStateProvider, { value }, children),
  );
});

function TabsTriggerStateProvider({ value, children }: ProviderProps<UseTabsContext | null>) {
  const {
    value: selectedValue,
    visualValue,
    registerTrigger,
    updateTriggerDisabled,
    updateTriggerWidth,
    selectValue,
  } = value ?? {};
  const trigger = useMemo<TriggerContextValue | null>(() => {
    if (!registerTrigger || !updateTriggerDisabled || !updateTriggerWidth || !selectValue) {
      return null;
    }
    return {
      value: selectedValue,
      visualValue,
      registerTrigger,
      updateTriggerDisabled,
      updateTriggerWidth,
      selectValue,
    };
  }, [
    selectedValue,
    visualValue,
    registerTrigger,
    updateTriggerDisabled,
    updateTriggerWidth,
    selectValue,
  ]);
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
