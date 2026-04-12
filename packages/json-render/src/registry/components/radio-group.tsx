import type { BaseComponentProps } from "@json-render/react";
import {
  RadioGroup as SnippetRadioGroup,
  RadioGroupItem as SnippetRadioGroupItem,
} from "~/registry/ui/radio-group";

export const RadioGroup = ({ props, children }: BaseComponentProps) => (
  <SnippetRadioGroup {...(props as any)}>{children}</SnippetRadioGroup>
);

export const RadioGroupItem = ({ props }: BaseComponentProps) => (
  <SnippetRadioGroupItem {...(props as any)} />
);
