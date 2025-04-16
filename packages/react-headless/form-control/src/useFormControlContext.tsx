import { createContext, useContext } from "react";
import type { UseFormControlReturn } from "./useFormControl";

export interface UseFormControlContext extends UseFormControlReturn {}

const FormControlContext = createContext<UseFormControlContext | null>(null);

export const FormControlProvider = FormControlContext.Provider;

export function useFormControlContext<T extends boolean | undefined = true>({
  strict = true,
}: { strict?: T } = {}): T extends false ? UseFormControlContext | null : UseFormControlContext {
  const context = useContext(FormControlContext);
  if (!context && strict) {
    throw new Error("useFormControlContext must be used within a FormControl");
  }

  return context as UseFormControlContext;
}
