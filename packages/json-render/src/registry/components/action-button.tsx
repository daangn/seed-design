import type { BaseComponentProps } from "@json-render/react";
import { ActionButton as SnippetActionButton } from "~/registry/ui/action-button";
import { hasChildren } from "./utils";

export const ActionButton = ({ props, children }: BaseComponentProps) => {
  const { label, ...rest } = props as Record<string, unknown>;
  return (
    <SnippetActionButton {...(rest as any)}>
      {hasChildren(children) ? children : (label as string)}
    </SnippetActionButton>
  );
};
