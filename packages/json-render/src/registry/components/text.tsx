import type { BaseComponentProps } from "@json-render/react";
import { Text as SeedText } from "@seed-design/react";
import { hasChildren } from "./utils";

export const Text = ({ props, children }: BaseComponentProps) => {
  const { content, ...rest } = props as Record<string, unknown>;
  return (
    <SeedText {...(rest as any)}>{hasChildren(children) ? children : (content as string)}</SeedText>
  );
};
