import { createContext, useContext } from "react";
import type { UseTextFieldReturn } from "./useTextField";

export interface UseTextFieldContext extends UseTextFieldReturn {}

const TextFieldContext = createContext<UseTextFieldContext | null>(null);

export const TextFieldProvider = TextFieldContext.Provider;

export function useTextFieldContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseTextFieldContext | null : UseTextFieldContext {
  const context = useContext(TextFieldContext);
  if (!context && strict) {
    throw new Error("useTextFieldContext must be used within a TextField");
  }

  return context as UseTextFieldContext;
}
