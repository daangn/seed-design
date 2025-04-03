"use client";

import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import { Icon, HelpBubble as SeedHelpBubble } from "@seed-design/react";
import { forwardRef } from "react";

export interface HelpBubbleTriggerProps
  extends Omit<SeedHelpBubble.RootProps, "children"> {
  title: string;

  description?: string;

  showCloseButton?: boolean;

  children?: React.ReactNode;

  contentProps?: SeedHelpBubble.ContentProps;
}

export const HelpBubbleTrigger = forwardRef<
  HTMLButtonElement,
  HelpBubbleTriggerProps
>((props, ref) => {
  const {
    showCloseButton = false,
    title,
    description,
    contentProps,
    children,
    ...otherProps
  } = props;

  return (
    <SeedHelpBubble.Root {...otherProps}>
      <SeedHelpBubble.Trigger asChild ref={ref}>
        {children}
      </SeedHelpBubble.Trigger>
      <SeedHelpBubble.Positioner>
        <SeedHelpBubble.Content {...contentProps}>
          {showCloseButton ? (
            <SeedHelpBubble.CloseButton>
              <Icon svg={<IconXmarkLine />} />
            </SeedHelpBubble.CloseButton>
          ) : null}
          <SeedHelpBubble.Arrow>
            <SeedHelpBubble.ArrowTip />
          </SeedHelpBubble.Arrow>
          <SeedHelpBubble.Title>{props.title}</SeedHelpBubble.Title>
          {props.description && (
            <SeedHelpBubble.Description>
              {props.description}
            </SeedHelpBubble.Description>
          )}
        </SeedHelpBubble.Content>
      </SeedHelpBubble.Positioner>
    </SeedHelpBubble.Root>
  );
});

export interface HelpBubbleAnchorProps
  extends Omit<SeedHelpBubble.RootProps, "children"> {
  title: string;

  description?: string;

  showCloseButton?: boolean;

  children?: React.ReactNode;

  contentProps?: SeedHelpBubble.ContentProps;
}

export const HelpBubbleAnchor = forwardRef<
  HTMLDivElement,
  HelpBubbleAnchorProps
>((props, ref) => {
  const {
    showCloseButton = false,
    title,
    description,
    children,
    contentProps,
    ...otherProps
  } = props;

  return (
    <SeedHelpBubble.Root {...otherProps}>
      <SeedHelpBubble.Anchor asChild ref={ref}>
        {children}
      </SeedHelpBubble.Anchor>
      <SeedHelpBubble.Positioner>
        <SeedHelpBubble.Content {...contentProps}>
          {showCloseButton ? (
            <SeedHelpBubble.CloseButton>
              <Icon svg={<IconXmarkLine />} />
            </SeedHelpBubble.CloseButton>
          ) : null}
          <SeedHelpBubble.Arrow>
            <SeedHelpBubble.ArrowTip />
          </SeedHelpBubble.Arrow>
          <SeedHelpBubble.Title>{props.title}</SeedHelpBubble.Title>
          {props.description && (
            <SeedHelpBubble.Description>
              {props.description}
            </SeedHelpBubble.Description>
          )}
        </SeedHelpBubble.Content>
      </SeedHelpBubble.Positioner>
    </SeedHelpBubble.Root>
  );
});

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
