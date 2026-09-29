import * as React from "@lynx-js/react";
import type { SheetRootRef } from "@lynx-js/lynx-ui-sheet";

export interface BottomSheetContextValue {
  /** `SheetRoot`의 imperative handle입니다. 시트가 mount되기 전에도 `open()`을 호출할 수 있습니다. */
  rootRef: React.RefObject<SheetRootRef | null>;
  /** Root의 `skipAnimation` 값입니다. */
  skipAnimation: boolean;
}

export const BottomSheetContext = React.createContext<BottomSheetContextValue | null>(null);

export function useBottomSheetContext(consumer: string): BottomSheetContextValue {
  const context = React.useContext(BottomSheetContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <BottomSheetRoot/>.`);
  return context;
}
