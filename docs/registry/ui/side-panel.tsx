"use client";

import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import { Icon, SidePanel as SeedSidePanel, VisuallyHidden } from "@seed-design/react";
import type * as React from "react";
import { forwardRef } from "react";

export interface SidePanelRootProps extends SeedSidePanel.RootProps {}

/**
 * @see https://seed-design.io/react/components/side-panel
 */
export const SidePanelRoot = (props: SidePanelRootProps) => {
  const { children, ...otherProps } = props;
  return <SeedSidePanel.Root {...otherProps}>{children}</SeedSidePanel.Root>;
};

export interface SidePanelTriggerProps extends SeedSidePanel.TriggerProps {}

export const SidePanelTrigger = SeedSidePanel.Trigger;

export interface SidePanelContentProps extends Omit<SeedSidePanel.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;

  /**
   * @default true
   */
  showCloseButton?: boolean;
}

export const SidePanelContent = forwardRef<HTMLDivElement, SidePanelContentProps>(
  ({ children, title, description, layerIndex, showCloseButton = true, ...otherProps }, ref) => {
    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "SidePanelContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    const shouldRenderHeader = title || description;

    return (
      <SeedSidePanel.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
        <SeedSidePanel.Backdrop />
        <SeedSidePanel.Content ref={ref} {...otherProps}>
          {shouldRenderHeader && (
            <SeedSidePanel.Header>
              {title ? (
                <SeedSidePanel.Title>{title}</SeedSidePanel.Title>
              ) : (
                <VisuallyHidden asChild>
                  <SeedSidePanel.Title>{otherProps["aria-label"] || ""}</SeedSidePanel.Title>
                </VisuallyHidden>
              )}
              {description && <SeedSidePanel.Description>{description}</SeedSidePanel.Description>}
            </SeedSidePanel.Header>
          )}
          {children}
          {showCloseButton && (
            <SeedSidePanel.CloseButton aria-label="닫기">
              <Icon svg={<IconXmarkLine />} />
            </SeedSidePanel.CloseButton>
          )}
        </SeedSidePanel.Content>
      </SeedSidePanel.Positioner>
    );
  },
);

SidePanelContent.displayName = "SidePanelContent";

export interface SidePanelBodyProps extends SeedSidePanel.BodyProps {}

export const SidePanelBody = SeedSidePanel.Body;

export interface SidePanelFooterProps extends SeedSidePanel.FooterProps {}

export const SidePanelFooter = SeedSidePanel.Footer;
