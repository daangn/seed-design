import { Dialog as DialogPrimitive, useDialogContext } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { dialog, type DialogVariantProps } from "@seed-design/css/recipes/dialog";
import { forwardRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withRootProvider, withContext } = createSlotRecipeContext(dialog);
const withStateProps = createWithStateProps([useDialogContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogRootProps extends DialogVariantProps, DialogPrimitive.RootProps {}

export const DialogRoot = withRootProvider<DialogRootProps>(DialogPrimitive.Root, {
  defaultProps: {
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface DialogTriggerProps extends DialogPrimitive.TriggerProps {}

export const DialogTrigger = DialogPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface DialogPositionerProps extends DialogPrimitive.PositionerProps {}

export const DialogPositioner = withContext<HTMLDivElement, DialogPositionerProps>(
  DialogPrimitive.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogBackdropProps extends DialogPrimitive.BackdropProps {}

export const DialogBackdrop = withContext<HTMLDivElement, DialogBackdropProps>(
  DialogPrimitive.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogContentProps extends DialogPrimitive.ContentProps {}

export const DialogContent = withContext<HTMLDivElement, DialogContentProps>(
  DialogPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogHeaderProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = withContext<HTMLDivElement, DialogHeaderProps>(Primitive.div, "header");

////////////////////////////////////////////////////////////////////////////////////

export interface DialogTitleProps extends DialogPrimitive.TitleProps {}

export const DialogTitle = withContext<HTMLHeadingElement, DialogTitleProps>(
  withStateProps(Primitive.span),
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogDescriptionProps extends DialogPrimitive.DescriptionProps {}

export const DialogDescription = withContext<HTMLParagraphElement, DialogDescriptionProps>(
  withStateProps(Primitive.div),
  "description",
);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogFooterProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = withContext<HTMLDivElement, DialogFooterProps>(Primitive.div, "footer");

////////////////////////////////////////////////////////////////////////////////////

export interface DialogActionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const DialogAction = forwardRef<HTMLButtonElement, DialogActionProps>((props, ref) => {
  const api = useDialogContext();
  return <Primitive.button {...props} ref={ref} onClick={() => api.setOpen(false)} />;
});
