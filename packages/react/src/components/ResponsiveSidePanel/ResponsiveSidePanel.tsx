import type { Drawer } from "@seed-design/react-drawer";
import type { PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";
import { useBreakpointValue } from "../../hooks/useBreakpointValue";
import type { StyleProps } from "../../utils/styled";
import {
  BottomSheetBackdrop,
  BottomSheetBody,
  BottomSheetCloseButton,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetPositioner,
  BottomSheetRoot,
  type BottomSheetRootProps,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "../BottomSheet";
import { BottomSheetHandle, type BottomSheetHandleProps } from "../BottomSheetHandle";
import {
  SidePanelBackdrop,
  SidePanelBody,
  SidePanelCloseButton,
  SidePanelContent,
  SidePanelDescription,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelPositioner,
  SidePanelRoot,
  type SidePanelRootProps,
  SidePanelTitle,
  SidePanelTrigger,
} from "../SidePanel";

////////////////////////////////////////////////////////////////////////////////////

interface ResponsiveSidePanelContextValue {
  /**
   * Whether the panel currently renders as a BottomSheet (`true`) or a SidePanel
   * (`false`). `undefined` until the breakpoint resolves, treated as SidePanel.
   */
  shouldUseBottomSheet: boolean | undefined;
}

const ResponsiveSidePanelContext = React.createContext<ResponsiveSidePanelContextValue | null>(
  null,
);

export function useResponsiveSidePanelContext() {
  const ctx = React.useContext(ResponsiveSidePanelContext);
  if (!ctx) {
    throw new Error(
      "ResponsiveSidePanel sub-components must be used inside <ResponsiveSidePanelRoot>",
    );
  }

  return ctx;
}

////////////////////////////////////////////////////////////////////////////////////

type ResponsiveSidePanelRootManagedProp = "children" | "open" | "defaultOpen" | "onOpenChange";

export interface ResponsiveSidePanelRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Props forwarded to the underlying SidePanel root (md+). */
  sidePanelRootProps?: Omit<SidePanelRootProps, ResponsiveSidePanelRootManagedProp>;

  /** Props forwarded to the underlying BottomSheet root (sm-). */
  bottomSheetRootProps?: Omit<BottomSheetRootProps, ResponsiveSidePanelRootManagedProp>;
}

/**
 * Automatically switches between SidePanel (md+) and BottomSheet (sm-).
 *
 * The open state is managed here so the panel stays open while the viewport
 * crosses the breakpoint (SidePanel and BottomSheet are different component
 * instances and would otherwise re-initialize their own open state on swap).
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
    <ResponsiveSidePanelContext.Provider value={value}>
      {shouldUseBottomSheet ? (
        <BottomSheetRoot {...bottomSheetRootProps} open={open} onOpenChange={setOpen}>
          {children}
        </BottomSheetRoot>
      ) : (
        <SidePanelRoot {...sidePanelRootProps} open={open} onOpenChange={setOpen}>
          {children}
        </SidePanelRoot>
      )}
    </ResponsiveSidePanelContext.Provider>
  );
};

////////////////////////////////////////////////////////////////////////////////////

export interface ResponsiveSidePanelTriggerProps extends Drawer.TriggerProps {}

export const ResponsiveSidePanelTrigger = React.forwardRef<
  HTMLButtonElement,
  ResponsiveSidePanelTriggerProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

  return shouldUseBottomSheet ? (
    <BottomSheetTrigger ref={ref} {...props} />
  ) : (
    <SidePanelTrigger ref={ref} {...props} />
  );
});
ResponsiveSidePanelTrigger.displayName = "ResponsiveSidePanelTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface ResponsiveSidePanelPositionerProps extends Drawer.PositionerProps {}

export const ResponsiveSidePanelPositioner = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelPositionerProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

  return shouldUseBottomSheet ? (
    <BottomSheetPositioner ref={ref} {...props} />
  ) : (
    <SidePanelPositioner ref={ref} {...props} />
  );
});
ResponsiveSidePanelPositioner.displayName = "ResponsiveSidePanelPositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface ResponsiveSidePanelBackdropProps extends Drawer.BackdropProps {}

export const ResponsiveSidePanelBackdrop = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelBackdropProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

  return shouldUseBottomSheet ? (
    <BottomSheetBackdrop ref={ref} {...props} />
  ) : (
    <SidePanelBackdrop ref={ref} {...props} />
  );
});
ResponsiveSidePanelBackdrop.displayName = "ResponsiveSidePanelBackdrop";

////////////////////////////////////////////////////////////////////////////////////

/**
 * `width` / `maxWidth` only apply in SidePanel mode (md+); they are ignored when
 * rendered as a BottomSheet.
 */
export interface ResponsiveSidePanelContentProps
  extends Drawer.ContentProps,
    Pick<StyleProps, "width" | "maxWidth"> {}

export const ResponsiveSidePanelContent = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelContentProps
>(({ width, maxWidth, ...props }, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

  return shouldUseBottomSheet ? (
    <BottomSheetContent ref={ref} {...props} />
  ) : (
    <SidePanelContent ref={ref} width={width} maxWidth={maxWidth} {...props} />
  );
});
ResponsiveSidePanelContent.displayName = "ResponsiveSidePanelContent";

////////////////////////////////////////////////////////////////////////////////////

export interface ResponsiveSidePanelHeaderProps extends Drawer.HeaderProps {}

export const ResponsiveSidePanelHeader = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelHeaderProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

  return shouldUseBottomSheet ? (
    <BottomSheetHeader ref={ref} {...props} />
  ) : (
    <SidePanelHeader ref={ref} {...props} />
  );
});
ResponsiveSidePanelHeader.displayName = "ResponsiveSidePanelHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface ResponsiveSidePanelTitleProps extends Drawer.TitleProps {}

export const ResponsiveSidePanelTitle = React.forwardRef<
  HTMLHeadingElement,
  ResponsiveSidePanelTitleProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

  return shouldUseBottomSheet ? (
    <BottomSheetTitle ref={ref} {...props} />
  ) : (
    <SidePanelTitle ref={ref} {...props} />
  );
});
ResponsiveSidePanelTitle.displayName = "ResponsiveSidePanelTitle";

////////////////////////////////////////////////////////////////////////////////////

export interface ResponsiveSidePanelDescriptionProps extends Drawer.DescriptionProps {}

export const ResponsiveSidePanelDescription = React.forwardRef<
  HTMLParagraphElement,
  ResponsiveSidePanelDescriptionProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

  return shouldUseBottomSheet ? (
    <BottomSheetDescription ref={ref} {...props} />
  ) : (
    <SidePanelDescription ref={ref} {...props} />
  );
});
ResponsiveSidePanelDescription.displayName = "ResponsiveSidePanelDescription";

////////////////////////////////////////////////////////////////////////////////////

export interface ResponsiveSidePanelBodyProps
  extends PrimitiveProps,
    Pick<
      StyleProps,
      "paddingX" | "height" | "maxHeight" | "minHeight" | "justifyContent" | "alignItems"
    >,
    React.HTMLAttributes<HTMLDivElement> {}

export const ResponsiveSidePanelBody = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelBodyProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

  return shouldUseBottomSheet ? (
    <BottomSheetBody ref={ref} {...props} />
  ) : (
    <SidePanelBody ref={ref} {...props} />
  );
});
ResponsiveSidePanelBody.displayName = "ResponsiveSidePanelBody";

////////////////////////////////////////////////////////////////////////////////////

export interface ResponsiveSidePanelFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const ResponsiveSidePanelFooter = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelFooterProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

  return shouldUseBottomSheet ? (
    <BottomSheetFooter ref={ref} {...props} />
  ) : (
    <SidePanelFooter ref={ref} {...props} />
  );
});
ResponsiveSidePanelFooter.displayName = "ResponsiveSidePanelFooter";

////////////////////////////////////////////////////////////////////////////////////

export interface ResponsiveSidePanelCloseButtonProps extends Drawer.CloseButtonProps {}

export const ResponsiveSidePanelCloseButton = React.forwardRef<
  HTMLButtonElement,
  ResponsiveSidePanelCloseButtonProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();

  return shouldUseBottomSheet ? (
    <BottomSheetCloseButton ref={ref} {...props} />
  ) : (
    <SidePanelCloseButton ref={ref} {...props} />
  );
});
ResponsiveSidePanelCloseButton.displayName = "ResponsiveSidePanelCloseButton";

////////////////////////////////////////////////////////////////////////////////////

export interface ResponsiveSidePanelHandleProps extends BottomSheetHandleProps {}

/**
 * Renders the BottomSheet drag handle in BottomSheet mode (sm-) and nothing in
 * SidePanel mode (md+), since SidePanel has no handle.
 */
export const ResponsiveSidePanelHandle = React.forwardRef<
  HTMLDivElement,
  ResponsiveSidePanelHandleProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveSidePanelContext();
  if (!shouldUseBottomSheet) return null;

  return <BottomSheetHandle ref={ref} {...props} />;
});
ResponsiveSidePanelHandle.displayName = "ResponsiveSidePanelHandle";
