import * as React from "@lynx-js/react";
import type { UseAppBarReturn } from "./useAppBar.js";

export const AppBarContext = React.createContext<UseAppBarReturn | null>(null);

export function useAppBarContext(consumer: string): UseAppBarReturn {
  const context = React.useContext(AppBarContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <AppBarRoot/>.`);
  return context;
}
