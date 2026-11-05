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
  type Dialog,
  DialogAction,
  DialogBackdrop,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../Dialog";

type SharedProps<DialogProps, BottomSheetProps> = Pick<
  DialogProps,
  Extract<keyof DialogProps, keyof BottomSheetProps>
> &
  Pick<BottomSheetProps, Extract<keyof BottomSheetProps, keyof DialogProps>>;

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

  /** Props forwarded to the underlying Dialog root (at and above the breakpoint). */
  dialogRootProps?: Omit<Dialog.RootProps, "children" | "open" | "defaultOpen" | "onOpenChange">;

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
        <DialogRoot {...dialogRootProps} open={open} onOpenChange={setOpen}>
          {children}
        </DialogRoot>
      )}
    </ResponsiveDialogContext.Provider>
  );
};
ResponsiveDialogRoot.displayName = "ResponsiveDialogRoot";

export interface ResponsiveDialogTriggerProps
  extends SharedProps<Dialog.TriggerProps, BottomSheet.TriggerProps> {}

export const ResponsiveDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  ResponsiveDialogTriggerProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetTrigger ref={ref} {...props} />
  ) : (
    <DialogTrigger ref={ref} {...props} />
  );
});
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

export interface ResponsiveDialogPositionerProps
  extends SharedProps<Dialog.PositionerProps, BottomSheet.PositionerProps> {}

export const ResponsiveDialogPositioner = React.forwardRef<
  HTMLDivElement,
  ResponsiveDialogPositionerProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetPositioner ref={ref} {...props} />
  ) : (
    <DialogPositioner ref={ref} {...props} />
  );
});
ResponsiveDialogPositioner.displayName = "ResponsiveDialogPositioner";

export interface ResponsiveDialogBackdropProps
  extends SharedProps<Dialog.BackdropProps, BottomSheet.BackdropProps> {}

export const ResponsiveDialogBackdrop = React.forwardRef<
  HTMLDivElement,
  ResponsiveDialogBackdropProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetBackdrop ref={ref} {...props} />
  ) : (
    <DialogBackdrop ref={ref} {...props} />
  );
});
ResponsiveDialogBackdrop.displayName = "ResponsiveDialogBackdrop";

export interface ResponsiveDialogContentProps
  extends SharedProps<Dialog.ContentProps, BottomSheet.ContentProps> {}

export const ResponsiveDialogContent = React.forwardRef<
  HTMLDivElement,
  ResponsiveDialogContentProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetContent ref={ref} {...props} />
  ) : (
    <DialogContent ref={ref} {...props} />
  );
});
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

export interface ResponsiveDialogHeaderProps
  extends SharedProps<Dialog.HeaderProps, BottomSheet.HeaderProps> {}

export const ResponsiveDialogHeader = React.forwardRef<HTMLDivElement, ResponsiveDialogHeaderProps>(
  (props, ref) => {
    const { shouldUseBottomSheet } = useResponsiveDialogContext();

    return shouldUseBottomSheet ? (
      <BottomSheetHeader ref={ref} {...props} />
    ) : (
      <DialogHeader ref={ref} {...props} />
    );
  },
);
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

export interface ResponsiveDialogTitleProps
  extends SharedProps<Dialog.TitleProps, BottomSheet.TitleProps> {}

export const ResponsiveDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  ResponsiveDialogTitleProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetTitle ref={ref} {...props} />
  ) : (
    <DialogTitle ref={ref} {...props} />
  );
});
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";

export interface ResponsiveDialogDescriptionProps
  extends SharedProps<Dialog.DescriptionProps, BottomSheet.DescriptionProps> {}

export const ResponsiveDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  ResponsiveDialogDescriptionProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetDescription ref={ref} {...props} />
  ) : (
    <DialogDescription ref={ref} {...props} />
  );
});
ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription";

export interface ResponsiveDialogBodyProps
  extends SharedProps<Dialog.BodyProps, BottomSheet.BodyProps> {}

export const ResponsiveDialogBody = React.forwardRef<HTMLDivElement, ResponsiveDialogBodyProps>(
  (props, ref) => {
    const { shouldUseBottomSheet } = useResponsiveDialogContext();

    return shouldUseBottomSheet ? (
      <BottomSheetBody ref={ref} {...props} />
    ) : (
      <DialogBody ref={ref} {...props} />
    );
  },
);
ResponsiveDialogBody.displayName = "ResponsiveDialogBody";

export interface ResponsiveDialogFooterProps
  extends SharedProps<Dialog.FooterProps, BottomSheet.FooterProps> {}

export const ResponsiveDialogFooter = React.forwardRef<HTMLDivElement, ResponsiveDialogFooterProps>(
  (props, ref) => {
    const { shouldUseBottomSheet } = useResponsiveDialogContext();

    return shouldUseBottomSheet ? (
      <BottomSheetFooter ref={ref} {...props} />
    ) : (
      <DialogFooter ref={ref} {...props} />
    );
  },
);
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

/**
 * Unstyled button that closes the dialog or bottom sheet on click, meant to be
 * composed with an action button via `asChild`.
 */
export interface ResponsiveDialogActionProps
  extends SharedProps<Dialog.ActionProps, Drawer.CloseButtonProps> {}

export const ResponsiveDialogAction = React.forwardRef<
  HTMLButtonElement,
  ResponsiveDialogActionProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <Drawer.CloseButton ref={ref} {...props} />
  ) : (
    <DialogAction ref={ref} {...props} />
  );
});
ResponsiveDialogAction.displayName = "ResponsiveDialogAction";

export interface ResponsiveDialogCloseButtonProps
  extends SharedProps<Dialog.CloseButtonProps, BottomSheet.CloseButtonProps> {}

export const ResponsiveDialogCloseButton = React.forwardRef<
  HTMLButtonElement,
  ResponsiveDialogCloseButtonProps
>((props, ref) => {
  const { shouldUseBottomSheet } = useResponsiveDialogContext();

  return shouldUseBottomSheet ? (
    <BottomSheetCloseButton ref={ref} {...props} />
  ) : (
    <DialogCloseButton ref={ref} {...props} />
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
