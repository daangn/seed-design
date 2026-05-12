"use client";

import { useBreakpoint } from "@seed-design/react";
import * as React from "react";
import {
  BottomSheetBody,
  BottomSheetContent,
  type BottomSheetContentProps,
  BottomSheetFooter,
  type BottomSheetFooterProps,
  type BottomSheetBodyProps,
  BottomSheetRoot,
  type BottomSheetRootProps,
  BottomSheetTrigger,
  type BottomSheetTriggerProps,
} from "./bottom-sheet";
import {
  SidePanelBody,
  type SidePanelBodyProps,
  SidePanelContent,
  type SidePanelContentProps,
  SidePanelFooter,
  type SidePanelFooterProps,
  SidePanelRoot,
  type SidePanelRootProps,
  SidePanelTrigger,
  type SidePanelTriggerProps,
} from "./side-panel";

interface ResponsiveContextValue {
  isMobile: boolean;
}

const ResponsiveContext = React.createContext<ResponsiveContextValue | null>(null);

function useResponsiveContext() {
  const ctx = React.useContext(ResponsiveContext);
  if (!ctx) {
    throw new Error(
      "ResponsiveSidePanel sub-components must be used inside <ResponsiveSidePanelRoot>",
    );
  }
  return ctx;
}

export interface ResponsiveSidePanelRootProps extends Omit<SidePanelRootProps, "direction"> {
  /**
   * Direction of the panel when shown as SidePanel (md+ viewports).
   * Ignored on sm- viewports (rendered as BottomSheet).
   * @default "right"
   */
  direction?: SidePanelRootProps["direction"];
}

/**
 * Automatically switches between SidePanel (md+) and BottomSheet (sm-).
 *
 * Persistent (`modal={false}`) is forced to `modal={true}` on sm- to
 * fall back to a modal experience that suits small viewports.
 *
 * @see https://seed-design.io/react/components/side-panel
 */
export function ResponsiveSidePanelRoot({
  children,
  modal = true,
  ...props
}: ResponsiveSidePanelRootProps) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "base" || breakpoint === "sm";
  const resolvedModal = isMobile ? true : modal;

  const value = React.useMemo(() => ({ isMobile }), [isMobile]);

  return (
    <ResponsiveContext.Provider value={value}>
      {isMobile ? (
        <BottomSheetRoot modal={resolvedModal} {...(props as BottomSheetRootProps)}>
          {children}
        </BottomSheetRoot>
      ) : (
        <SidePanelRoot modal={resolvedModal} {...props}>
          {children}
        </SidePanelRoot>
      )}
    </ResponsiveContext.Provider>
  );
}

export interface ResponsiveSidePanelTriggerProps extends SidePanelTriggerProps {}

export const ResponsiveSidePanelTrigger = React.forwardRef<
  HTMLButtonElement,
  ResponsiveSidePanelTriggerProps
>((props, ref) => {
  const { isMobile } = useResponsiveContext();
  return isMobile ? (
    <BottomSheetTrigger ref={ref} {...(props as BottomSheetTriggerProps)} />
  ) : (
    <SidePanelTrigger ref={ref} {...props} />
  );
});
ResponsiveSidePanelTrigger.displayName = "ResponsiveSidePanelTrigger";

export interface ResponsiveSidePanelContentProps extends SidePanelContentProps {}

export const ResponsiveSidePanelContent = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelContentProps
>((props, ref) => {
  const { isMobile } = useResponsiveContext();
  return isMobile ? (
    <BottomSheetContent ref={ref} {...(props as BottomSheetContentProps)} />
  ) : (
    <SidePanelContent ref={ref} {...props} />
  );
});
ResponsiveSidePanelContent.displayName = "ResponsiveSidePanelContent";

export interface ResponsiveSidePanelBodyProps extends SidePanelBodyProps {}

export const ResponsiveSidePanelBody = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelBodyProps
>((props, ref) => {
  const { isMobile } = useResponsiveContext();
  return isMobile ? (
    <BottomSheetBody ref={ref} {...(props as BottomSheetBodyProps)} />
  ) : (
    <SidePanelBody ref={ref} {...props} />
  );
});
ResponsiveSidePanelBody.displayName = "ResponsiveSidePanelBody";

export interface ResponsiveSidePanelFooterProps extends SidePanelFooterProps {}

export const ResponsiveSidePanelFooter = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelFooterProps
>((props, ref) => {
  const { isMobile } = useResponsiveContext();
  return isMobile ? (
    <BottomSheetFooter ref={ref} {...(props as BottomSheetFooterProps)} />
  ) : (
    <SidePanelFooter ref={ref} {...props} />
  );
});
ResponsiveSidePanelFooter.displayName = "ResponsiveSidePanelFooter";
