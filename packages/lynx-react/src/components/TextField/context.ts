import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";

/** iOS와 Android의 32비트 `maxlength` setter에서 사용하는 무제한 센티널. */
export const NATIVE_TEXT_MAX_LENGTH_UNLIMITED = 2_147_483_647;

export interface TextFieldContextValue {
  rootRef: React.RefObject<NodesRef | null>;
  value: string;
  valueRevision: number;
  nativeInsertionMaxLength?: number;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  required: boolean;
  name?: string;
  focused: boolean;
  setValue: (value: string) => void;
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
