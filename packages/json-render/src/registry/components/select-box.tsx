import type { BaseComponentProps } from "@json-render/react";
import {
  RadioSelectBoxRoot as SnippetRadioSelectBoxRoot,
  RadioSelectBoxItem as SnippetRadioSelectBoxItem,
  CheckSelectBoxGroup as SnippetCheckSelectBoxGroup,
  CheckSelectBox as SnippetCheckSelectBox,
} from "~/registry/ui/select-box";

export const RadioSelectBoxRoot = ({ props, children }: BaseComponentProps) => (
  <SnippetRadioSelectBoxRoot {...(props as any)}>{children}</SnippetRadioSelectBoxRoot>
);

export const RadioSelectBoxItem = ({ props }: BaseComponentProps) => (
  <SnippetRadioSelectBoxItem {...(props as any)} />
);

export const CheckSelectBoxGroup = ({ props, children }: BaseComponentProps) => (
  <SnippetCheckSelectBoxGroup {...(props as any)}>{children}</SnippetCheckSelectBoxGroup>
);

export const CheckSelectBox = ({ props }: BaseComponentProps) => (
  <SnippetCheckSelectBox {...(props as any)} />
);
