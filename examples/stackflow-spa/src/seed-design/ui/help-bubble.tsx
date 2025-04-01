"use client";

import IconXmarkLine from "@daangn/react-monochrome-icon/IconXmarkLine";
import { Icon, HelpBubble as SeedHelpBubble } from "@seed-design/react";
import { forwardRef } from "react";

export interface HelpBubbleTriggerProps extends Omit<SeedHelpBubble.RootProps, "children"> {
  title: string;

  description?: string;

  showCloseButton?: boolean;

  children?: React.ReactNode;

  contentProps?: SeedHelpBubble.ContentProps;
}

export const HelpBubbleTrigger = forwardRef<HTMLButtonElement, HelpBubbleTriggerProps>(
  (props, ref) => {
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
              <SeedHelpBubble.Description>{props.description}</SeedHelpBubble.Description>
            )}
          </SeedHelpBubble.Content>
        </SeedHelpBubble.Positioner>
      </SeedHelpBubble.Root>
    );
  },
);

export interface HelpBubbleAnchorProps extends Omit<SeedHelpBubble.RootProps, "children"> {
  title: string;

  description?: string;

  showCloseButton?: boolean;

  children?: React.ReactNode;
}

export const HelpBubbleAnchor = forwardRef<HTMLDivElement, HelpBubbleAnchorProps>((props, ref) => {
  const {
    open,
    defaultOpen,
    onOpenChange,
    showCloseButton = false,
    title,
    description,
    ...otherProps
  } = props;

  return (
    <SeedHelpBubble.Root>
      <SeedHelpBubble.Anchor asChild ref={ref} {...otherProps} />
      <SeedHelpBubble.Positioner>
        <SeedHelpBubble.Content>
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
            <SeedHelpBubble.Description>{props.description}</SeedHelpBubble.Description>
          )}
        </SeedHelpBubble.Content>
      </SeedHelpBubble.Positioner>
    </SeedHelpBubble.Root>
  );
});
