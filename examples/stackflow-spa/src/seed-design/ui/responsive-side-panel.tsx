import { useBreakpointValue } from "@seed-design/react";
import { useControllableState } from "@seed-design/react-use-controllable-state";
import * as React from "react";
import * as SeedBottomSheet from "./bottom-sheet";
import * as SeedSidePanel from "./side-panel";

const ResponsiveContext = React.createContext<{ shouldUseBottomSheet: boolean | undefined } | null>(
  null,
);

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
  direction = "right",
  size,
  ...props
}: ResponsiveSidePanelRootProps) => {
  const shouldUseBottomSheet = useBreakpointValue({ base: true, md: false });

  const [open, setOpen] = useControllableState<
    boolean,
    Parameters<NonNullable<ResponsiveSidePanelRootProps["onOpenChange"]>>[1]
  >({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: "ResponsiveSidePanelRoot",
  });

  const value = React.useMemo(() => ({ shouldUseBottomSheet }), [shouldUseBottomSheet]);

  return (
    <ResponsiveContext.Provider value={value}>
      {shouldUseBottomSheet ? (
        <SeedBottomSheet.BottomSheetRoot open={open} onOpenChange={setOpen} {...props}>
          {children}
        </SeedBottomSheet.BottomSheetRoot>
      ) : (
        <SeedSidePanel.SidePanelRoot
          open={open}
          onOpenChange={setOpen}
          direction={direction}
          size={size}
          {...props}
        >
          {children}
        </SeedSidePanel.SidePanelRoot>
      )}
    </ResponsiveContext.Provider>
  );
};

export interface ResponsiveSidePanelTriggerProps extends SeedSidePanel.SidePanelTriggerProps {}

export const ResponsiveSidePanelTrigger = React.forwardRef<
  HTMLButtonElement,
  ResponsiveSidePanelTriggerProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveContext();
  const Trigger = shouldUseBottomSheet
    ? SeedBottomSheet.BottomSheetTrigger
    : SeedSidePanel.SidePanelTrigger;
  return <Trigger ref={ref} {...props} />;
});
ResponsiveSidePanelTrigger.displayName = "ResponsiveSidePanelTrigger";

export interface ResponsiveSidePanelContentProps extends SeedSidePanel.SidePanelContentProps {}

export const ResponsiveSidePanelContent = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelContentProps
>(({ width, maxWidth, ...props }, ref) => {
  const { shouldUseBottomSheet } = useResponsiveContext();
  if (shouldUseBottomSheet) {
    return <SeedBottomSheet.BottomSheetContent ref={ref} {...props} />;
  }

  return <SeedSidePanel.SidePanelContent ref={ref} width={width} maxWidth={maxWidth} {...props} />;
});
ResponsiveSidePanelContent.displayName = "ResponsiveSidePanelContent";

export interface ResponsiveSidePanelBodyProps extends SeedSidePanel.SidePanelBodyProps {}

export const ResponsiveSidePanelBody = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelBodyProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveContext();
  const Body = shouldUseBottomSheet ? SeedBottomSheet.BottomSheetBody : SeedSidePanel.SidePanelBody;
  return <Body ref={ref} {...props} />;
});
ResponsiveSidePanelBody.displayName = "ResponsiveSidePanelBody";

export interface ResponsiveSidePanelFooterProps extends SeedSidePanel.SidePanelFooterProps {}

export const ResponsiveSidePanelFooter = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelFooterProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveContext();
  const Footer = shouldUseBottomSheet
    ? SeedBottomSheet.BottomSheetFooter
    : SeedSidePanel.SidePanelFooter;
  return <Footer ref={ref} {...props} />;
});
ResponsiveSidePanelFooter.displayName = "ResponsiveSidePanelFooter";
