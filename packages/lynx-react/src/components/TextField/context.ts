import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";

export interface TextFieldContextValue {
  rootRef: React.RefObject<NodesRef | null>;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  required: boolean;
  focused: boolean;
  setFocused: (focused: boolean) => void;
}

export const TextFieldContext = React.createContext<TextFieldContextValue | null>(null);

export function useTextFieldContext(): TextFieldContextValue {
  const context = React.useContext(TextFieldContext);

  if (!context) {
    throw new Error("TextField compound components must be rendered inside <TextField.Root>.");
  }

  return context;
}
