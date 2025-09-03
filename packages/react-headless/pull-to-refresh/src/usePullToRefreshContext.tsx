import { createContext, useContext } from "react";
import type { UsePullToRefreshReturn } from "./usePullToRefresh";

export interface UsePullToRefreshContext extends UsePullToRefreshReturn {}

const PullToRefreshContext = createContext<UsePullToRefreshContext | null>(null);

export const PullToRefreshProvider = PullToRefreshContext.Provider;

export function usePullToRefreshContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UsePullToRefreshContext | null : UsePullToRefreshContext {
  const context = useContext(PullToRefreshContext);
  if (!context && strict) {
    throw new Error("usePullToRefreshContext must be used within a PullToRefresh");
  }

  return context as UsePullToRefreshContext;
}
