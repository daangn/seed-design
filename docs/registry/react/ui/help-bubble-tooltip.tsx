"use client";

import { HelpBubbleTooltip as SeedHelpBubbleTooltip } from "@seed-design/react";
import { forwardRef } from "react";
import type * as React from "react";

export const HelpBubbleTooltipDelayGroup = SeedHelpBubbleTooltip.DelayGroup;
export interface HelpBubbleTooltipDelayGroupProps extends SeedHelpBubbleTooltip.DelayGroupProps {}

export interface HelpBubbleTooltipTriggerProps
  extends Omit<SeedHelpBubbleTooltip.RootProps, "children"> {
  title: React.ReactNode;

  description?: React.ReactNode;

  children?: React.ReactNode;

  contentProps?: SeedHelpBubbleTooltip.ContentProps;

  zIndexOffset?: number;
}

export const HelpBubbleTooltipTrigger = forwardRef<
  HTMLButtonElement,
  HelpBubbleTooltipTriggerProps
>(({ title, description, contentProps, zIndexOffset, children, ...otherProps }, ref) => {
  return (
    <SeedHelpBubbleTooltip.Root {...otherProps}>
      <SeedHelpBubbleTooltip.Trigger asChild ref={ref}>
        {children}
      </SeedHelpBubbleTooltip.Trigger>
      <SeedHelpBubbleTooltip.Positioner
        style={{ "--z-index-offset": zIndexOffset } as React.CSSProperties}
      >
        <SeedHelpBubbleTooltip.Content {...contentProps}>
          <SeedHelpBubbleTooltip.Arrow>
            <SeedHelpBubbleTooltip.ArrowTip />
          </SeedHelpBubbleTooltip.Arrow>
          <SeedHelpBubbleTooltip.Body>
            <SeedHelpBubbleTooltip.Title>{title}</SeedHelpBubbleTooltip.Title>
            {description && (
              <SeedHelpBubbleTooltip.Description>{description}</SeedHelpBubbleTooltip.Description>
            )}
          </SeedHelpBubbleTooltip.Body>
        </SeedHelpBubbleTooltip.Content>
      </SeedHelpBubbleTooltip.Positioner>
    </SeedHelpBubbleTooltip.Root>
  );
});
HelpBubbleTooltipTrigger.displayName = "HelpBubbleTooltipTrigger";

export interface HelpBubbleTooltipTriggerPortalProps
  extends Omit<SeedHelpBubbleTooltip.RootProps, "children"> {
  title: React.ReactNode;

  description?: React.ReactNode;

  children?: React.ReactNode;

  contentProps?: SeedHelpBubbleTooltip.ContentProps;

  zIndexOffset?: number;

  positionerRoot?: SeedHelpBubbleTooltip.PositionerPortalProps["root"];
}

export const HelpBubbleTooltipTriggerPortal = forwardRef<
  HTMLButtonElement,
  HelpBubbleTooltipTriggerPortalProps
>(
  (
    { title, description, contentProps, zIndexOffset, positionerRoot, children, ...otherProps },
    ref,
  ) => {
    return (
      <SeedHelpBubbleTooltip.Root {...otherProps}>
        <SeedHelpBubbleTooltip.Trigger asChild ref={ref}>
          {children}
        </SeedHelpBubbleTooltip.Trigger>
        <SeedHelpBubbleTooltip.PositionerPortal
          root={positionerRoot}
          style={{ "--z-index-offset": zIndexOffset } as React.CSSProperties}
        >
          <SeedHelpBubbleTooltip.Content {...contentProps}>
            <SeedHelpBubbleTooltip.Arrow>
              <SeedHelpBubbleTooltip.ArrowTip />
            </SeedHelpBubbleTooltip.Arrow>
            <SeedHelpBubbleTooltip.Body>
              <SeedHelpBubbleTooltip.Title>{title}</SeedHelpBubbleTooltip.Title>
              {description && (
                <SeedHelpBubbleTooltip.Description>{description}</SeedHelpBubbleTooltip.Description>
              )}
            </SeedHelpBubbleTooltip.Body>
          </SeedHelpBubbleTooltip.Content>
        </SeedHelpBubbleTooltip.PositionerPortal>
      </SeedHelpBubbleTooltip.Root>
    );
  },
);
HelpBubbleTooltipTriggerPortal.displayName = "HelpBubbleTooltipTriggerPortal";
