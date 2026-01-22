import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useId, useMemo } from "react";

export interface UseDialogStateProps {
  open?: boolean;

  defaultOpen?: boolean;

  onOpenChange?: (open: boolean) => void;
}

function useDialogState(props: UseDialogStateProps) {
  const [open = false, onOpenChange] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen,
    onChange: props.onOpenChange,
  });

  return useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);
}

export interface UseDialogProps extends UseDialogStateProps {
  /**
   * The role of the dialog.
   * @default "dialog"
   */
  role?: "dialog" | "alertdialog";

  /**
   * Whether to close the dialog when the outside is clicked
   * @default true
   */
  closeOnInteractOutside?: boolean;

  /**
   * Whether to close the dialog when the escape key is pressed
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether to enable lazy mounting
   * @default false
   */
  lazyMount?: boolean;
  /**
   * Whether to unmount on exit.
   * @default false
   */
  unmountOnExit?: boolean;
}

export type UseDialogReturn = ReturnType<typeof useDialog>;

export function useDialog(props: UseDialogProps = {}) {
  const { open, onOpenChange } = useDialogState(props);

  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-open": dataAttr(open),
        "data-hidden": dataAttr(!open),
      }),
    [open],
  );

  return useMemo(
    () => ({
      open,
      setOpen: onOpenChange,
      closeOnInteractOutside: props.closeOnInteractOutside ?? true,
      closeOnEscape: props.closeOnEscape ?? true,
      lazyMount: props.lazyMount ?? false,
      unmountOnExit: props.unmountOnExit ?? false,
      stateProps,
      triggerProps: buttonProps({
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        ...stateProps,
        onClick: (e) => {
          if (e.defaultPrevented) return;
          onOpenChange(true);
        },
      }),
      positionerProps: elementProps({
        ...stateProps,
        style: {
          pointerEvents: open ? undefined : "none",
        },
      }),
      backdropProps: elementProps({
        ...stateProps,
      }),
      contentProps: elementProps({
        ...stateProps,
        role: props.role ?? "dialog",
        "aria-modal": true,
        "aria-labelledby": titleId,
        "aria-describedby": descriptionId,
      }),
      titleProps: elementProps({
        id: titleId,
        ...stateProps,
      }),
      descriptionProps: elementProps({
        id: descriptionId,
        ...stateProps,
      }),
      closeButtonProps: buttonProps({
        ...stateProps,
        onClick: (e) => {
          if (e.defaultPrevented) return;
          onOpenChange(false);
        },
      }),
    }),
    [
      open,
      onOpenChange,
      stateProps,
      titleId,
      descriptionId,
      props.role,
      props.closeOnInteractOutside,
      props.closeOnEscape,
      props.lazyMount,
      props.unmountOnExit,
    ],
  );
}
