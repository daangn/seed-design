import type { BaseComponentProps } from "@json-render/react";
import {
  Checkbox as SnippetCheckbox,
  CheckboxGroup as SnippetCheckboxGroup,
} from "~/registry/ui/checkbox";

export const CheckboxGroup = ({ props, children }: BaseComponentProps) => (
  <SnippetCheckboxGroup {...(props as any)}>{children}</SnippetCheckboxGroup>
);

export const Checkbox = ({ props }: BaseComponentProps) => <SnippetCheckbox {...(props as any)} />;
