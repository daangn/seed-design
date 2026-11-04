import { createContext, useContext } from "react";
import type { UseNextAppScreenReturn } from "./useNextAppScreen";

export interface UseNextAppScreenContext extends UseNextAppScreenReturn {}

const NextAppScreenContext = createContext<UseNextAppScreenContext | null>(null);

export const NextAppScreenProvider = NextAppScreenContext.Provider;

export function useNextAppScreenContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseNextAppScreenContext | null : UseNextAppScreenContext {
  const context = useContext(NextAppScreenContext);
  if (!context && strict) {
    throw new Error("useNextAppScreenContext must be used within a NextAppScreen");
  }

  return context as UseNextAppScreenContext;
}
