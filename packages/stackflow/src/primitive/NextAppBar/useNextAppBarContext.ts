import { createContext, useContext } from "react";
import type { UseNextAppBarReturn } from "./useNextAppBar";

export interface UseNextAppBarContext extends UseNextAppBarReturn {}

const NextAppBarContext = createContext<UseNextAppBarContext | null>(null);

export const NextAppBarProvider = NextAppBarContext.Provider;

export function useNextAppBarContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseNextAppBarContext | null : UseNextAppBarContext {
  const context = useContext(NextAppBarContext);
  if (!context && strict) {
    throw new Error("useNextAppBarContext must be used within a NextAppBar");
  }

  return context as UseNextAppBarContext;
}
