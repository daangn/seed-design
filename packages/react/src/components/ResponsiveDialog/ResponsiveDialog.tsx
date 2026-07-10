import type { Breakpoint } from "@seed-design/css/breakpoints";
import { Drawer } from "@seed-design/react-drawer";
import * as React from "react";
import { useBreakpointValue } from "../../hooks/useBreakpointValue";
import {
  type BottomSheet,
  BottomSheetBackdrop,
  BottomSheetBody,
  BottomSheetCloseButton,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetPositioner,
  BottomSheetRoot,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "../BottomSheet";
import { BottomSheetHandle } from "../BottomSheetHandle";
import {
  type ContentDialog,
  ContentDialogAction,
  ContentDialogBackdrop,
  ContentDialogBody,
  ContentDialogCloseButton,
  ContentDialogContent,
  ContentDialogDescription,
  ContentDialogFooter,
  ContentDialogHeader,
  ContentDialogPositioner,
  ContentDialogRoot,
  ContentDialogTitle,
  ContentDialogTrigger,
} from "../ContentDialog";

type SharedProps<ContentDialogProps, BottomSheetProps> = Pick<
  ContentDialogProps,
  Extract<keyof ContentDialogProps, keyof BottomSheetProps>
> &
  Pick<BottomSheetProps, Extract<keyof BottomSheetProps, keyof ContentDialogProps>>;

interface ResponsiveDialogContextValue {
  shouldUseBottomSheet: boolean | undefined;
}

const ResponsiveDialogContext = React.createContext<ResponsiveDialogContextValue | null>(null);

export function useResponsiveDialogContext() {
  const ctx = React.useContext(ResponsiveDialogContext);
  if (!ctx) {
    throw new Error("ResponsiveDialog sub-components must be used inside <ResponsiveDialogRoot>");
  }

  return ctx;
}

export interface ResponsiveDialogRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /**
   * Breakpoint at and above which it renders as a Dialog; below it, a
   * BottomSheet. Cannot be `"base"`, which would always be a Dialog.
   * @default "md"
   */
  dialogBreakpoint?: Exclude<Breakpoint, "base">;

  /** Props forwarded to the underlying ContentDialog root (at and above the breakpoint). */
  dialogRootProps?: Omit<
    ContentDialog.RootProps,
    "children" | "open" | "defaultOpen" | "onOpenChange"
  >;

  /** Props forwarded to the underlying BottomSheet root (below the breakpoint). */
  bottomSheetRootProps?: Omit<
    BottomSheet.RootProps,
    "children" | "open" | "defaultOpen" | "onOpenChange"
  >;
}

export const ResponsiveDialogRoot = ({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  dialogBreakpoint = "md",
  dialogRootProps,
  bottomSheetRootProps,
}: ResponsiveDialogRootProps) => {
  const shouldUseBottomSheet = useBreakpointValue({ base: true, [dialogBreakpoint]: false });

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
    <ResponsiveDialogContext.Provider value={value}>
      {shouldUseBottomSheet ? (
        <BottomSheetRoot {...bottomSheetRootProps} open={open} onOpenChange={setOpen}>
          {children}
        </BottomSheetRoot>
      ) : (
        <ContentDialogRoot {...dialogRootProps} open={open} onOpenChange={setOpen}>
          {children}
        </ContentDialogRoot>
      )}
    </ResponsiveDialogContext.Provider>
  );
};

export interface ResponsiveDialogTriggerProps
  extends SharedProps<ContentDialog.TriggerProps, BottomSheet.TriggerProps> {}

export const ResponsiveDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  ResponsiveDialogTriggerProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetTrigger ref={ref} {...props} />
  ) : (
    <ContentDialogTrigger ref={ref} {...props} />
  );
});
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

export interface ResponsiveDialogPositionerProps
  extends SharedProps<ContentDialog.PositionerProps, BottomSheet.PositionerProps> {}

export const ResponsiveDialogPositioner = React.forwardRef<
  HTMLDivElement,
  ResponsiveDialogPositionerProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetPositioner ref={ref} {...props} />
  ) : (
    <ContentDialogPositioner ref={ref} {...props} />
  );
});
ResponsiveDialogPositioner.displayName = "ResponsiveDialogPositioner";

export interface ResponsiveDialogBackdropProps
  extends SharedProps<ContentDialog.BackdropProps, BottomSheet.BackdropProps> {}

export const ResponsiveDialogBackdrop = React.forwardRef<
  HTMLDivElement,
  ResponsiveDialogBackdropProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetBackdrop ref={ref} {...props} />
  ) : (
    <ContentDialogBackdrop ref={ref} {...props} />
  );
});
ResponsiveDialogBackdrop.displayName = "ResponsiveDialogBackdrop";

export interface ResponsiveDialogContentProps
  extends SharedProps<ContentDialog.ContentProps, BottomSheet.ContentProps> {}

export const ResponsiveDialogContent = React.forwardRef<
  HTMLDivElement,
  ResponsiveDialogContentProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetContent ref={ref} {...props} />
  ) : (
    <ContentDialogContent ref={ref} {...props} />
  );
});
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

export interface ResponsiveDialogHeaderProps
  extends SharedProps<ContentDialog.HeaderProps, BottomSheet.HeaderProps> {}

export const ResponsiveDialogHeader = React.forwardRef<HTMLDivElement, ResponsiveDialogHeaderProps>(
  (props, ref) => {
    const { shouldUseBottomSheet } = useResponsiveDialogContext();

    return shouldUseBottomSheet ? (
      <BottomSheetHeader ref={ref} {...props} />
    ) : (
      <ContentDialogHeader ref={ref} {...props} />
    );
  },
);
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

export interface ResponsiveDialogTitleProps
  extends SharedProps<ContentDialog.TitleProps, BottomSheet.TitleProps> {}

export const ResponsiveDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  ResponsiveDialogTitleProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetTitle ref={ref} {...props} />
  ) : (
    <ContentDialogTitle ref={ref} {...props} />
  );
});
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";

export interface ResponsiveDialogDescriptionProps
  extends SharedProps<ContentDialog.DescriptionProps, BottomSheet.DescriptionProps> {}

export const ResponsiveDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  ResponsiveDialogDescriptionProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetDescription ref={ref} {...props} />
  ) : (
    <ContentDialogDescription ref={ref} {...props} />
  );
});
ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription";

export interface ResponsiveDialogBodyProps
  extends SharedProps<ContentDialog.BodyProps, BottomSheet.BodyProps> {}

export const ResponsiveDialogBody = React.forwardRef<HTMLDivElement, ResponsiveDialogBodyProps>(
  (props, ref) => {
    const { shouldUseBottomSheet } = useResponsiveDialogContext();

    return shouldUseBottomSheet ? (
      <BottomSheetBody ref={ref} {...props} />
    ) : (
      <ContentDialogBody ref={ref} {...props} />
    );
  },
);
ResponsiveDialogBody.displayName = "ResponsiveDialogBody";

export interface ResponsiveDialogFooterProps
  extends SharedProps<ContentDialog.FooterProps, BottomSheet.FooterProps> {}

export const ResponsiveDialogFooter = React.forwardRef<HTMLDivElement, ResponsiveDialogFooterProps>(
  (props, ref) => {
    const { shouldUseBottomSheet } = useResponsiveDialogContext();

    return shouldUseBottomSheet ? (
      <BottomSheetFooter ref={ref} {...props} />
    ) : (
      <ContentDialogFooter ref={ref} {...props} />
    );
  },
);
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

/**
 * Unstyled button that closes the dialog or bottom sheet on click, meant to be
 * composed with an action button via `asChild`.
 */
export interface ResponsiveDialogActionProps
  extends SharedProps<ContentDialog.ActionProps, Drawer.CloseButtonProps> {}

export const ResponsiveDialogAction = React.forwardRef<
  HTMLButtonElement,
  ResponsiveDialogActionProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <Drawer.CloseButton ref={ref} {...props} />
  ) : (
    <ContentDialogAction ref={ref} {...props} />
  );
});
ResponsiveDialogAction.displayName = "ResponsiveDialogAction";

export interface ResponsiveDialogCloseButtonProps
  extends SharedProps<ContentDialog.CloseButtonProps, BottomSheet.CloseButtonProps> {}

export const ResponsiveDialogCloseButton = React.forwardRef<
  HTMLButtonElement,
  ResponsiveDialogCloseButtonProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetCloseButton ref={ref} {...props} />
  ) : (
    <ContentDialogCloseButton ref={ref} {...props} />
  );
});
ResponsiveDialogCloseButton.displayName = "ResponsiveDialogCloseButton";

export interface ResponsiveDialogHandleProps extends BottomSheet.HandleProps {}

export const ResponsiveDialogHandle = React.forwardRef<HTMLDivElement, ResponsiveDialogHandleProps>(
  (props, ref) => {
    const { shouldUseBottomSheet } = useResponsiveDialogContext();
    if (!shouldUseBottomSheet) return null;

    return <BottomSheetHandle ref={ref} {...props} />;
  },
);
ResponsiveDialogHandle.displayName = "ResponsiveDialogHandle";
