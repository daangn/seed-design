import { createContext, useContext } from "react";
import type { UsePopoverReturn } from "./usePopover";

export interface UsePopoverContext extends UsePopoverReturn {}

const PopoverContext = createContext<UsePopoverContext | null>(null);

export const PopoverProvider = PopoverContext.Provider;

export function usePopoverContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UsePopoverContext | null : UsePopoverContext {
  const context = useContext(PopoverContext);
  if (!context && strict) {
    throw new Error("usePopoverContext must be used within a Popover");
  }

  return context as UsePopoverContext;
}
