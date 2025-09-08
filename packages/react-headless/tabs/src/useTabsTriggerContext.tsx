import { createContext, useContext } from "react";
import type { GetTriggerPropsReturn } from "./useTabs";

export interface UseTabsTriggerContext extends GetTriggerPropsReturn {}

const TabsTriggerContext = createContext<UseTabsTriggerContext | null>(null);

export const TabsTriggerProvider = TabsTriggerContext.Provider;

export function useTabsTriggerContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseTabsTriggerContext | null : UseTabsTriggerContext {
  const context = useContext(TabsTriggerContext);
  if (!context && strict) {
    throw new Error("useTabsTriggerContext must be used within a TabsTrigger");
  }

  return context as UseTabsTriggerContext;
}
