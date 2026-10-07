import { createContext, useContext, useMemo, type Provider } from "@lynx-js/react";
import type { UsePullToRefreshContext } from "./usePullToRefresh";

export type { UsePullToRefreshContext } from "./usePullToRefresh";
const Context = createContext<UsePullToRefreshContext | null>(null);
export const PullToRefreshProvider: Provider<UsePullToRefreshContext | null> = Context.Provider;

export function usePullToRefreshContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UsePullToRefreshContext | null : UsePullToRefreshContext {
  const context = useContext(Context);
  if (!context && strict) throw new Error("PullToRefresh.Root 내부에서 사용해야 합니다.");
  return context as T extends false ? UsePullToRefreshContext | null : UsePullToRefreshContext;
}

/**
 * @platform Lynx
 * Root 내부에서 호출하고 반환 props를 보호할 native view에 펼칩니다.
 * 해당 view에 별도의 main-thread:bindtouchstart를 함께 지정하면 보호 handler를 덮어씁니다.
 * React의 preventPull attribute 객체와 다르게 hook 호출이 필요합니다.
 */
export function usePullToRefreshPreventPull() {
  const { prevented } = usePullToRefreshContext();
  return useMemo(
    () => ({
      "main-thread:bindtouchstart": () => {
        "main thread";
        prevented.current = true;
      },
    }),
    [prevented],
  );
}
