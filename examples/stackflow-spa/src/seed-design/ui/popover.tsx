import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import { Icon, Popover as SeedPopover } from "@seed-design/react";
import type * as React from "react";
import { forwardRef } from "react";

export interface PopoverRootProps extends SeedPopover.RootProps {}

/**
 * @see https://seed-design.io/react/components/popover
 */
export const PopoverRoot = SeedPopover.Root;

export interface PopoverTriggerProps extends SeedPopover.TriggerProps {}

export const PopoverTrigger = SeedPopover.Trigger;

export interface PopoverAnchorProps extends SeedPopover.AnchorProps {}

export const PopoverAnchor = SeedPopover.Anchor;

export interface PopoverContentProps extends Omit<SeedPopover.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  zIndexOffset?: number;

  /**
   * @default true
   */
  showCloseButton?: boolean;
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, title, description, zIndexOffset, showCloseButton = true, ...otherProps }, ref) => {
    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "PopoverContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    const shouldRenderHeader = title || description || showCloseButton;

    return (
      <SeedPopover.PositionerPortal
        style={{ "--z-index-offset": zIndexOffset } as React.CSSProperties}
      >
        <SeedPopover.Content ref={ref} {...otherProps}>
          {shouldRenderHeader && (
            <SeedPopover.Header>
              {title && <SeedPopover.Title>{title}</SeedPopover.Title>}
              {description && <SeedPopover.Description>{description}</SeedPopover.Description>}
              {showCloseButton && (
                // You may implement your own i18n for dismiss label
                <SeedPopover.CloseButton aria-label="닫기">
                  <Icon svg={<IconXmarkLine />} />
                </SeedPopover.CloseButton>
              )}
            </SeedPopover.Header>
          )}
          {children}
        </SeedPopover.Content>
      </SeedPopover.PositionerPortal>
    );
  },
);

PopoverContent.displayName = "PopoverContent";

export interface PopoverBodyProps extends SeedPopover.BodyProps {}

export const PopoverBody = SeedPopover.Body;

export interface PopoverFooterProps extends SeedPopover.FooterProps {}

export const PopoverFooter = SeedPopover.Footer;
