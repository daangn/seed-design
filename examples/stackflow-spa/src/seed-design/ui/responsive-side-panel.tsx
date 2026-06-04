import { useBreakpointValue } from "@seed-design/react";
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

type ResponsiveSidePanelRootManagedProp =
  | "children"
  | "open"
  | "defaultOpen"
  | "onOpenChange";

export interface ResponsiveSidePanelRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  sidePanelRootProps?: Omit<
    SeedSidePanel.SidePanelRootProps,
    ResponsiveSidePanelRootManagedProp
  >;

  bottomSheetRootProps?: Omit<
    SeedBottomSheet.BottomSheetRootProps,
    ResponsiveSidePanelRootManagedProp
  >;
}

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
  sidePanelRootProps,
  bottomSheetRootProps,
}: ResponsiveSidePanelRootProps) => {
  const shouldUseBottomSheet = useBreakpointValue({ base: true, md: false });

  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen === open) return;

      if (!isControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange, open],
  );

  const value = React.useMemo(() => ({ shouldUseBottomSheet }), [shouldUseBottomSheet]);

  return (
    <ResponsiveContext.Provider value={value}>
      {shouldUseBottomSheet ? (
        <SeedBottomSheet.BottomSheetRoot
          {...bottomSheetRootProps}
          open={open}
          onOpenChange={setOpen}
        >
          {children}
        </SeedBottomSheet.BottomSheetRoot>
      ) : (
        <SeedSidePanel.SidePanelRoot
          {...sidePanelRootProps}
          open={open}
          onOpenChange={setOpen}
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
