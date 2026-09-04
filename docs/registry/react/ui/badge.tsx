"use client";

import { IconILowercaseSerifCircleLine } from "@karrotmarket/react-monochrome-icon";
import { Badge as SeedBadge, Icon } from "@seed-design/react";
import * as React from "react";

export interface BadgeActionOptions extends Omit<SeedBadge.ActionProps, "aria-label" | "children"> {
  "aria-label": string;
  render?: (trigger: React.ReactElement) => React.ReactNode;
}

export type BadgeProps = Omit<SeedBadge.RootProps, "children" | "prefix"> & {
  children: React.ReactNode;
} & (
    | {
        prefix?: React.ReactNode;
        action?: never;
      }
    | {
        prefix?: never;
        action?: BadgeActionOptions;
      }
  );

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, prefix, action, ...props }, ref) => {
    let actionElement: React.ReactElement | null = null;
    let renderAction: BadgeActionOptions["render"];

    if (action) {
      const { render, ...actionProps } = action;
      renderAction = render;
      actionElement = (
        <SeedBadge.Action {...actionProps}>
          <Icon size="full" svg={<IconILowercaseSerifCircleLine />} />
        </SeedBadge.Action>
      );
    }

    return (
      <SeedBadge.Root ref={ref} {...props}>
        {prefix != null ? (
          <SeedBadge.Prefix>
            <Icon size="full" svg={prefix} />
          </SeedBadge.Prefix>
        ) : null}
        <SeedBadge.Label>{children}</SeedBadge.Label>
        {actionElement ? (renderAction ? renderAction(actionElement) : actionElement) : null}
      </SeedBadge.Root>
    );
  },
);
Badge.displayName = "Badge";
