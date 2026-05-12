"use client";

import IconXmarkLine from "@karrotmarket/react-monochrome-icon/IconXmarkLine";
import {
  BottomSheet as SeedBottomSheet,
  Icon,
  SidePanel as SeedSidePanel,
  useBreakpoint,
  VisuallyHidden,
} from "@seed-design/react";
import type * as React from "react";
import { createContext, forwardRef, useContext, useMemo } from "react";

const ResponsiveContext = createContext<{ isMobile: boolean } | null>(null);

function useResponsiveContext() {
  const ctx = useContext(ResponsiveContext);
  if (!ctx) {
    throw new Error(
      "ResponsiveSidePanel sub-components must be used inside <ResponsiveSidePanelRoot>",
    );
  }
  return ctx;
}

export interface ResponsiveSidePanelRootProps extends SeedSidePanel.RootProps {}

/**
 * Automatically switches between SidePanel (md+) and BottomSheet (sm-).
 * Persistent (`modal={false}`) is forced to `modal={true}` on sm-.
 *
 * @see https://seed-design.io/react/components/side-panel
 */
export const ResponsiveSidePanelRoot = ({
  children,
  modal = true,
  ...props
}: ResponsiveSidePanelRootProps) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "base" || breakpoint === "sm";
  const resolvedModal = isMobile ? true : modal;
  const value = useMemo(() => ({ isMobile }), [isMobile]);
  const Panel = isMobile ? SeedBottomSheet : SeedSidePanel;

  return (
    <ResponsiveContext.Provider value={value}>
      <Panel.Root modal={resolvedModal} {...props}>
        {children}
      </Panel.Root>
    </ResponsiveContext.Provider>
  );
};

export interface ResponsiveSidePanelTriggerProps extends SeedSidePanel.TriggerProps {}

export const ResponsiveSidePanelTrigger = SeedSidePanel.Trigger;

export interface ResponsiveSidePanelContentProps extends Omit<SeedSidePanel.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;

  /**
   * @default true
   */
  showCloseButton?: boolean;
}

export const ResponsiveSidePanelContent = forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelContentProps
>(({ children, title, description, layerIndex, showCloseButton = true, ...otherProps }, ref) => {
  const { isMobile } = useResponsiveContext();
  const Panel = isMobile ? SeedBottomSheet : SeedSidePanel;

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

  const shouldRenderHeader = title || description;

  return (
    <Panel.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
      <Panel.Backdrop />
      <Panel.Content ref={ref} {...otherProps}>
        {shouldRenderHeader && (
          <Panel.Header>
            {title ? (
              <Panel.Title>{title}</Panel.Title>
            ) : (
              <VisuallyHidden asChild>
                <Panel.Title>{otherProps["aria-label"] || ""}</Panel.Title>
              </VisuallyHidden>
            )}
            {description && <Panel.Description>{description}</Panel.Description>}
          </Panel.Header>
        )}
        {children}
        {showCloseButton && (
          <Panel.CloseButton aria-label="닫기">
            <Icon svg={<IconXmarkLine />} />
          </Panel.CloseButton>
        )}
      </Panel.Content>
    </Panel.Positioner>
  );
});

ResponsiveSidePanelContent.displayName = "ResponsiveSidePanelContent";

export interface ResponsiveSidePanelBodyProps extends SeedSidePanel.BodyProps {}

export const ResponsiveSidePanelBody = forwardRef<HTMLDivElement, ResponsiveSidePanelBodyProps>(
  (props, ref) => {
    const { isMobile } = useResponsiveContext();
    const Panel = isMobile ? SeedBottomSheet : SeedSidePanel;
    return <Panel.Body ref={ref} {...props} />;
  },
);

ResponsiveSidePanelBody.displayName = "ResponsiveSidePanelBody";

export interface ResponsiveSidePanelFooterProps extends SeedSidePanel.FooterProps {}

export const ResponsiveSidePanelFooter = forwardRef<HTMLDivElement, ResponsiveSidePanelFooterProps>(
  (props, ref) => {
    const { isMobile } = useResponsiveContext();
    const Panel = isMobile ? SeedBottomSheet : SeedSidePanel;
    return <Panel.Footer ref={ref} {...props} />;
  },
);

ResponsiveSidePanelFooter.displayName = "ResponsiveSidePanelFooter";
