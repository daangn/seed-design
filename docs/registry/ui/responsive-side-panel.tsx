"use client";

import { useBreakpoint } from "@seed-design/react";
import * as React from "react";
import * as SeedBottomSheet from "./bottom-sheet";
import * as SeedSidePanel from "./side-panel";

const ResponsiveContext = React.createContext<{ belowMd: boolean } | null>(null);

function useResponsiveContext() {
  const ctx = React.useContext(ResponsiveContext);
  if (!ctx) {
    throw new Error(
      "ResponsiveSidePanel sub-components must be used inside <ResponsiveSidePanelRoot>",
    );
  }
  return ctx;
}

export interface ResponsiveSidePanelRootProps extends SeedSidePanel.SidePanelRootProps {}

/**
 * Automatically switches between SidePanel (md+) and BottomSheet (sm-).
 *
 * The open state is managed here so the panel stays open while the
 * viewport crosses the breakpoint (SidePanel and BottomSheet are
 * different component instances and would otherwise re-initialize their
 * own open state on swap).
 *
 * @see https://seed-design.io/react/components/side-panel
 */
export const ResponsiveSidePanelRoot = ({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: ResponsiveSidePanelRootProps) => {
  const breakpoint = useBreakpoint();
  const belowMd = breakpoint === "base" || breakpoint === "sm";

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const value = React.useMemo(() => ({ belowMd }), [belowMd]);
  const Root = belowMd ? SeedBottomSheet.BottomSheetRoot : SeedSidePanel.SidePanelRoot;

  return (
    <ResponsiveContext.Provider value={value}>
      <Root open={open} onOpenChange={setOpen} {...props}>
        {children}
      </Root>
    </ResponsiveContext.Provider>
  );
};

export interface ResponsiveSidePanelTriggerProps extends SeedSidePanel.SidePanelTriggerProps {}

export const ResponsiveSidePanelTrigger = React.forwardRef<
  HTMLButtonElement,
  ResponsiveSidePanelTriggerProps
>((props, ref) => {
  const { belowMd } = useResponsiveContext();
  const Trigger = belowMd ? SeedBottomSheet.BottomSheetTrigger : SeedSidePanel.SidePanelTrigger;
  return <Trigger ref={ref} {...props} />;
});
ResponsiveSidePanelTrigger.displayName = "ResponsiveSidePanelTrigger";

export interface ResponsiveSidePanelContentProps extends SeedSidePanel.SidePanelContentProps {}

export const ResponsiveSidePanelContent = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelContentProps
>((props, ref) => {
  const { belowMd } = useResponsiveContext();
  const Content = belowMd ? SeedBottomSheet.BottomSheetContent : SeedSidePanel.SidePanelContent;
  return <Content ref={ref} {...props} />;
});
ResponsiveSidePanelContent.displayName = "ResponsiveSidePanelContent";

export interface ResponsiveSidePanelBodyProps extends SeedSidePanel.SidePanelBodyProps {}

export const ResponsiveSidePanelBody = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelBodyProps
>((props, ref) => {
  const { belowMd } = useResponsiveContext();
  const Body = belowMd ? SeedBottomSheet.BottomSheetBody : SeedSidePanel.SidePanelBody;
  return <Body ref={ref} {...props} />;
});
ResponsiveSidePanelBody.displayName = "ResponsiveSidePanelBody";

export interface ResponsiveSidePanelFooterProps extends SeedSidePanel.SidePanelFooterProps {}

export const ResponsiveSidePanelFooter = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelFooterProps
>((props, ref) => {
  const { belowMd } = useResponsiveContext();
  const Footer = belowMd ? SeedBottomSheet.BottomSheetFooter : SeedSidePanel.SidePanelFooter;
  return <Footer ref={ref} {...props} />;
});
ResponsiveSidePanelFooter.displayName = "ResponsiveSidePanelFooter";
