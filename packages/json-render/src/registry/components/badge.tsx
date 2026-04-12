import type { BaseComponentProps } from "@json-render/react";
import { Badge as SeedBadge } from "@seed-design/react";
import { hasChildren } from "./utils";

export const Badge = ({ props, children }: BaseComponentProps) => {
  const { label, ...rest } = props as Record<string, unknown>;
  return (
    <SeedBadge {...(rest as any)}>{hasChildren(children) ? children : (label as string)}</SeedBadge>
  );
};
