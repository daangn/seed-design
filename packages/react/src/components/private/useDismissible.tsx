import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { buttonProps, elementProps, mergeProps } from "@ride-developer/dom-utils";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import * as React from "react";

export interface UseDismissibleProps {
  defaultOpen?: boolean;
  open?: boolean;
  onDismiss?: () => void;
}

export type UseDismissibleReturn = ReturnType<typeof useDismissible>;

export function useDismissible(props: UseDismissibleProps) {
  const [open = true, setOpen] = useControllableState({
    prop: props.open,
    defaultProp: props.defaultOpen,
    onChange: (open) => {
      if (!open) {
        props.onDismiss?.();
      }
    },
  });

  const dismiss = React.useCallback(() => setOpen(false), [setOpen]);

  return {
    open,
    dismiss,

    rootProps: elementProps({}),

    dismissButtonProps: buttonProps({
      onClick: (e) => {
        if (e.defaultPrevented) return;

        dismiss();
      },
    }),
  };
}

const DismissibleContext = React.createContext<ReturnType<typeof useDismissible> | null>(null);

export const DismissibleProvider = DismissibleContext.Provider;

export const useDismissibleContext = () => {
  const context = React.useContext(DismissibleContext);
  if (context === null) {
    throw new Error("useDismissibleContext should be used within DismissibleProvider");
  }

  return context;
};

export interface DismissibleRootProps
  extends PrimitiveProps,
    UseDismissibleProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const DismissibleRoot = React.forwardRef<HTMLDivElement, DismissibleRootProps>(
  ({ defaultOpen, open, onDismiss, ...otherProps }, ref) => {
    const api = useDismissible({ defaultOpen, open, onDismiss });

    if (!api.open) return null;

    return (
      <DismissibleProvider value={api}>
        <Primitive.div ref={ref} {...otherProps} />
      </DismissibleProvider>
    );
  },
);

export interface DismissibleCloseButtonProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const DismissibleCloseButton = React.forwardRef<
  HTMLButtonElement,
  DismissibleCloseButtonProps
>((props, ref) => {
  const { dismissButtonProps } = useDismissibleContext();

  return <Primitive.button ref={ref} {...mergeProps(dismissButtonProps, props)} />;
});
