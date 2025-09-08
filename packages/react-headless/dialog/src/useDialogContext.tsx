import { createContext, useContext } from "react";
import type { UseDialogReturn } from "./useDialog";

export interface UseDialogContext extends UseDialogReturn {}

const DialogContext = createContext<UseDialogContext | null>(null);

export const DialogProvider = DialogContext.Provider;

export function useDialogContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseDialogContext | null : UseDialogContext {
  const context = useContext(DialogContext);
  if (!context && strict) {
    throw new Error("useDialogContext must be used within a Dialog");
  }

  return context as UseDialogContext;
}
