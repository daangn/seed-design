import { createContext, useContext } from "react";
import type { UseScrollFogReturn } from "./useScrollFog";

export interface UseScrollFogContext extends UseScrollFogReturn {}

const ScrollFogContext = createContext<UseScrollFogContext | null>(null);

export const ScrollFogProvider = ScrollFogContext.Provider;

export function useScrollFogContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseScrollFogContext | null : UseScrollFogContext {
  const context = useContext(ScrollFogContext);
  if (!context && strict) {
    throw new Error("useScrollFogContext must be used within a ScrollFog.Root");
  }

  return context as T extends false ? UseScrollFogContext | null : UseScrollFogContext;
}
