import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseProgressReturn } from "./useProgress.js";

export interface UseProgressCircleContext extends UseProgressReturn {}

const ProgressCircleContext = createContext<UseProgressCircleContext | null>(null);

export const ProgressCircleProvider: Provider<UseProgressCircleContext | null> =
  ProgressCircleContext.Provider;

/**
 * `ProgressCircleRoot`가 내려준 `useProgress` 결과를 하위 요소에서 읽습니다.
 * `strict: false`이면 Provider 밖에서 `null`을 반환합니다.
 */
export function useProgressCircleContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseProgressCircleContext | null : UseProgressCircleContext {
  const context = useContext(ProgressCircleContext);
  if (!context && strict) {
    throw new Error("useProgressCircleContext must be used within a ProgressCircleRoot");
  }
  return context as UseProgressCircleContext;
}
