"use client";

import { createContext, useContext } from "react";
import type { UseSideNavigationMenuItemReturn } from "./useSideNavigationMenuItem";

export interface UseSideNavigationMenuItemContext extends UseSideNavigationMenuItemReturn {}

const SideNavigationMenuItemContext = createContext<UseSideNavigationMenuItemContext | null>(null);

export const SideNavigationMenuItemProvider = SideNavigationMenuItemContext.Provider;

export function useSideNavigationMenuItemContext<T extends boolean | undefined = false>(
  { strict = false }: { strict?: T } = {} as { strict?: T },
): T extends true ? UseSideNavigationMenuItemContext : UseSideNavigationMenuItemContext | null {
  const context = useContext(SideNavigationMenuItemContext);
  if (!context && strict) {
    throw new Error(
      "useSideNavigationMenuItemContext must be used within a SideNavigationMenuItem",
    );
  }

  return context as any;
}
