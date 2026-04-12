import type { BaseComponentProps } from "@json-render/react";
import {
  TabsRoot as SnippetTabsRoot,
  TabsList as SnippetTabsList,
  TabsTrigger as SnippetTabsTrigger,
  TabsContent as SnippetTabsContent,
} from "~/registry/ui/tabs";
import { hasChildren } from "./utils";

export const TabsRoot = ({ props, children }: BaseComponentProps) => (
  <SnippetTabsRoot {...(props as any)}>{children}</SnippetTabsRoot>
);

export const TabsList = ({ props, children }: BaseComponentProps) => (
  <SnippetTabsList {...(props as any)}>{children}</SnippetTabsList>
);

export const TabsTrigger = ({ props, children }: BaseComponentProps) => {
  const { label, ...rest } = props as Record<string, unknown>;
  return (
    <SnippetTabsTrigger {...(rest as any)}>
      {hasChildren(children) ? children : (label as string)}
    </SnippetTabsTrigger>
  );
};

export const TabsContent = ({ props, children }: BaseComponentProps) => (
  <SnippetTabsContent {...(props as any)}>{children}</SnippetTabsContent>
);
