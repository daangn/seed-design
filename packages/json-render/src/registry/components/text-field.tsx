import type { BaseComponentProps } from "@json-render/react";
import {
  TextField as SnippetTextField,
  TextFieldInput as SnippetTextFieldInput,
  TextFieldTextarea as SnippetTextFieldTextarea,
} from "~/registry/ui/text-field";

export const TextField = ({ props, children }: BaseComponentProps) => (
  <SnippetTextField {...(props as any)}>{children}</SnippetTextField>
);

export const TextFieldInput = ({ props }: BaseComponentProps) => (
  <SnippetTextFieldInput {...(props as any)} />
);

export const TextFieldTextarea = ({ props }: BaseComponentProps) => (
  <SnippetTextFieldTextarea {...(props as any)} />
);
