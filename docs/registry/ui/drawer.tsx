"use client";

import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import { Icon, Drawer as SeedDrawer, VisuallyHidden } from "@seed-design/react";
import type * as React from "react";
import { forwardRef } from "react";

export interface DrawerRootProps extends SeedDrawer.RootProps {}

export const DrawerRoot = (props: DrawerRootProps) => {
  const { children, ...otherProps } = props;
  return <SeedDrawer.Root {...otherProps}>{children}</SeedDrawer.Root>;
};

export interface DrawerTriggerProps extends SeedDrawer.TriggerProps {}

export const DrawerTrigger = SeedDrawer.Trigger;

export interface DrawerContentProps extends Omit<SeedDrawer.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;

  /**
   * @default true
   */
  showCloseButton?: boolean;
}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ children, title, description, layerIndex, showCloseButton = true, ...otherProps }, ref) => {
    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "DrawerContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    const shouldRenderHeader = title || description;

    return (
      <SeedDrawer.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
        <SeedDrawer.Backdrop />
        <SeedDrawer.Content ref={ref} {...otherProps}>
          {shouldRenderHeader && (
            <SeedDrawer.Header>
              {title ? (
                <SeedDrawer.Title>{title}</SeedDrawer.Title>
              ) : (
                <VisuallyHidden asChild>
                  <SeedDrawer.Title>{otherProps["aria-label"] || ""}</SeedDrawer.Title>
                </VisuallyHidden>
              )}
              {description && <SeedDrawer.Description>{description}</SeedDrawer.Description>}
            </SeedDrawer.Header>
          )}
          {children}
          {showCloseButton && (
            <SeedDrawer.CloseButton aria-label="닫기">
              <Icon svg={<IconXmarkLine />} />
            </SeedDrawer.CloseButton>
          )}
        </SeedDrawer.Content>
      </SeedDrawer.Positioner>
    );
  },
);

DrawerContent.displayName = "DrawerContent";

export interface DrawerBodyProps extends SeedDrawer.BodyProps {}

export const DrawerBody = SeedDrawer.Body;

export interface DrawerFooterProps extends SeedDrawer.FooterProps {}

export const DrawerFooter = SeedDrawer.Footer;
