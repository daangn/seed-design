import { createContext, useContext } from "react";
import type { UsePresenceReturn } from "./usePresence";

export interface UsePresenceContext extends UsePresenceReturn {}

const PresenceContext = createContext<UsePresenceContext | null>(null);

export const PresenceProvider = PresenceContext.Provider;

export function usePresenceContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UsePresenceContext | null : UsePresenceContext {
  const context = useContext(PresenceContext);
  if (!context && strict) {
    throw new Error("usePresenceContext must be used within a Presence");
  }

  return context as UsePresenceContext;
}
