import type { BaseComponentProps } from "@json-render/react";
import {
  AlertDialogRoot as SnippetAlertDialogRoot,
  AlertDialogContent as SnippetAlertDialogContent,
  AlertDialogHeader as SnippetAlertDialogHeader,
  AlertDialogTitle as SnippetAlertDialogTitle,
  AlertDialogDescription as SnippetAlertDialogDescription,
  AlertDialogFooter as SnippetAlertDialogFooter,
  AlertDialogAction as SnippetAlertDialogAction,
} from "~/registry/ui/alert-dialog";
import { hasChildren } from "./utils";

export const AlertDialogRoot = ({ props, children }: BaseComponentProps) => (
  <SnippetAlertDialogRoot {...(props as any)}>{children}</SnippetAlertDialogRoot>
);

export const AlertDialogContent = ({ props, children }: BaseComponentProps) => (
  <SnippetAlertDialogContent {...(props as any)}>{children}</SnippetAlertDialogContent>
);

export const AlertDialogHeader = ({ props, children }: BaseComponentProps) => (
  <SnippetAlertDialogHeader {...(props as any)}>{children}</SnippetAlertDialogHeader>
);

export const AlertDialogTitle = ({ props, children }: BaseComponentProps) => {
  const { text, ...rest } = props as Record<string, unknown>;
  return (
    <SnippetAlertDialogTitle {...(rest as any)}>
      {hasChildren(children) ? children : (text as string)}
    </SnippetAlertDialogTitle>
  );
};

export const AlertDialogDescription = ({ props, children }: BaseComponentProps) => {
  const { text, ...rest } = props as Record<string, unknown>;
  return (
    <SnippetAlertDialogDescription {...(rest as any)}>
      {hasChildren(children) ? children : (text as string)}
    </SnippetAlertDialogDescription>
  );
};

export const AlertDialogFooter = ({ props, children }: BaseComponentProps) => (
  <SnippetAlertDialogFooter {...(props as any)}>{children}</SnippetAlertDialogFooter>
);

export const AlertDialogAction = ({ props, children }: BaseComponentProps) => {
  const { label, ...rest } = props as Record<string, unknown>;
  return (
    <SnippetAlertDialogAction {...(rest as any)}>
      {hasChildren(children) ? children : (label as string)}
    </SnippetAlertDialogAction>
  );
};
