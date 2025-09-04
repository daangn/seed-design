import { createContext, useContext } from "react";
import type { UseAvatarReturn } from "./useAvatar";

export interface UseAvatarContext extends UseAvatarReturn {}

const AvatarContext = createContext<UseAvatarContext | null>(null);

export const AvatarProvider = AvatarContext.Provider;

export function useAvatarContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseAvatarContext | null : UseAvatarContext {
  const context = useContext(AvatarContext);
  if (!context && strict) {
    throw new Error("useAvatarContext must be used within a Avatar");
  }

  return context as UseAvatarContext;
}
