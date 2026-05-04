"use client";

import { createContext, useContext } from "react";
import type { UseSideNavigationItemReturn } from "./useSideNavigationItem";

export interface UseSideNavigationItemContext extends UseSideNavigationItemReturn {}

const SideNavigationItemContext = createContext<UseSideNavigationItemContext | null>(null);

export const SideNavigationItemProvider = SideNavigationItemContext.Provider;

export function useSideNavigationItemContext<T extends boolean | undefined = false>(
  { strict = false }: { strict?: T } = {} as { strict?: T },
): T extends true ? UseSideNavigationItemContext : UseSideNavigationItemContext | null {
  const context = useContext(SideNavigationItemContext);
  if (!context && strict) {
    throw new Error("useSideNavigationItemContext must be used within a SideNavigationItem");
  }

  return context as any;
}
