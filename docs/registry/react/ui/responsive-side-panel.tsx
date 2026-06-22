"use client";

import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import {
  Icon,
  ResponsiveSidePanel as SeedResponsiveSidePanel,
  useResponsiveSidePanelContext,
  VisuallyHidden,
} from "@seed-design/react";
import type * as React from "react";
import { forwardRef } from "react";

export interface ResponsiveSidePanelRootProps extends SeedResponsiveSidePanel.RootProps {}

export const ResponsiveSidePanelRoot = SeedResponsiveSidePanel.Root;

export interface ResponsiveSidePanelTriggerProps extends SeedResponsiveSidePanel.TriggerProps {}

export const ResponsiveSidePanelTrigger = SeedResponsiveSidePanel.Trigger;

export interface ResponsiveSidePanelContentProps
  extends Omit<SeedResponsiveSidePanel.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;

  /**
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * @default false
   */
  showHandle?: boolean;
}

export const ResponsiveSidePanelContent = forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelContentProps
>(
  (
    {
      children,
      title,
      description,
      layerIndex,
      showCloseButton = true,
      showHandle = false,
      ...otherProps
    },
    ref,
  ) => {
    const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "ResponsiveSidePanelContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    if (shouldUseBottomSheet) {
      const shouldRenderHeader = title || description;

      return (
        <SeedResponsiveSidePanel.Positioner
          style={{ "--layer-index": layerIndex } as React.CSSProperties}
        >
          <SeedResponsiveSidePanel.Backdrop />
          <SeedResponsiveSidePanel.Content ref={ref} {...otherProps}>
            {showHandle && <SeedResponsiveSidePanel.Handle />}
            {shouldRenderHeader && (
              <SeedResponsiveSidePanel.Header>
                {title ? (
                  <SeedResponsiveSidePanel.Title>{title}</SeedResponsiveSidePanel.Title>
                ) : (
                  <VisuallyHidden asChild>
                    <SeedResponsiveSidePanel.Title>
                      {otherProps["aria-label"] || ""}
                    </SeedResponsiveSidePanel.Title>
                  </VisuallyHidden>
                )}
                {description && (
                  <SeedResponsiveSidePanel.Description>
                    {description}
                  </SeedResponsiveSidePanel.Description>
                )}
              </SeedResponsiveSidePanel.Header>
            )}
            {children}
            {showCloseButton && (
              <SeedResponsiveSidePanel.CloseButton aria-label="닫기">
                <Icon svg={<IconXmarkLine />} />
              </SeedResponsiveSidePanel.CloseButton>
            )}
          </SeedResponsiveSidePanel.Content>
        </SeedResponsiveSidePanel.Positioner>
      );
    }

    const shouldRenderHeader = title || description || showCloseButton;

    return (
      <SeedResponsiveSidePanel.Positioner
        style={{ "--layer-index": layerIndex } as React.CSSProperties}
      >
        <SeedResponsiveSidePanel.Backdrop />
        <SeedResponsiveSidePanel.Content ref={ref} {...otherProps}>
          {shouldRenderHeader && (
            <SeedResponsiveSidePanel.Header>
              {title && <SeedResponsiveSidePanel.Title>{title}</SeedResponsiveSidePanel.Title>}
              {description && (
                <SeedResponsiveSidePanel.Description>
                  {description}
                </SeedResponsiveSidePanel.Description>
              )}
              {showCloseButton && (
                <SeedResponsiveSidePanel.CloseButton aria-label="닫기">
                  <Icon svg={<IconXmarkLine />} />
                </SeedResponsiveSidePanel.CloseButton>
              )}
            </SeedResponsiveSidePanel.Header>
          )}
          {children}
        </SeedResponsiveSidePanel.Content>
      </SeedResponsiveSidePanel.Positioner>
    );
  },
);

ResponsiveSidePanelContent.displayName = "ResponsiveSidePanelContent";

export interface ResponsiveSidePanelBodyProps extends SeedResponsiveSidePanel.BodyProps {}

export const ResponsiveSidePanelBody = SeedResponsiveSidePanel.Body;

export interface ResponsiveSidePanelFooterProps extends SeedResponsiveSidePanel.FooterProps {}

export const ResponsiveSidePanelFooter = SeedResponsiveSidePanel.Footer;
