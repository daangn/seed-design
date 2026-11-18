import { createContext, useContext, type Provider } from "@lynx-js/react";
import type { UseTextFieldReturn } from "./useTextField.js";

export interface UseTextFieldContext extends UseTextFieldReturn {}

const TextFieldContext = createContext<UseTextFieldContext | null>(null);

export const TextFieldProvider: Provider<UseTextFieldContext | null> = TextFieldContext.Provider;

export function useTextFieldContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseTextFieldContext | null : UseTextFieldContext {
  const context = useContext(TextFieldContext);
  if (!context && strict) {
    throw new Error("useTextFieldContext must be used within a TextFieldRoot");
  }

  return context as UseTextFieldContext;
}
