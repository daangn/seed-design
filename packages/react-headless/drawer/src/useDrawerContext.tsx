import { createContext, useContext } from "react";

export type DrawerContextValue = ReturnType<typeof import("./useDrawer").useDrawer>;

const DrawerContext = createContext<DrawerContextValue | null>(null);

export const DrawerProvider = DrawerContext.Provider;

export function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (context === null) {
    throw new Error("useDrawerContext must be used within DrawerProvider");
  }
  return context;
}
