import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";

export interface FieldContextValue {
  rootRef: React.RefObject<NodesRef | null>;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  required: boolean;
  focused: boolean;
  setFocused: (focused: boolean) => void;
}

export const FieldContext = React.createContext<FieldContextValue | null>(null);

export function useFieldContext(options: { strict: true }): FieldContextValue;
export function useFieldContext(options?: { strict?: false }): FieldContextValue | null;
export function useFieldContext(options: { strict?: boolean } = {}): FieldContextValue | null {
  const context = React.useContext(FieldContext);

  if (options.strict && !context) {
    throw new Error("Field compound components must be rendered inside <Field.Root>.");
  }

  return context;
}
