'use client';
import { Dialog as DialogPrimitive, useDialogContext } from "@ride-developer/react-dialog";
import { Primitive, type PrimitiveProps } from "@ride-developer/react-primitive";
import { dialog, type DialogVariantProps } from "@ride-developer/css/recipes/dialog";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withRootProvider, withContext } = createSlotRecipeContext(dialog);
const withStateProps = createWithStateProps([useDialogContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface DialogRootProps extends DialogVariantProps, DialogPrimitive.RootProps {
  /**
   * @default true
   */
  lazyMount?: DialogPrimitive.RootProps["lazyMount"];
  /**
   * @default true
   */
  unmountOnExit?: DialogPrimitive.RootProps["unmountOnExit"];
}

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

// NOTE: uses DialogPrimitive.TitleProps,
// but actual rendered component is a Primitive.span rather than a DialogPrimitive.Title
// find out why later; misses h2 and some a11y features
export interface DialogTitleProps extends DialogPrimitive.TitleProps {}

export const DialogTitle = withContext<HTMLHeadingElement, DialogTitleProps>(
  withStateProps(Primitive.span),
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

// NOTE: uses DialogPrimitive.DescriptionProps,
// but actual rendered component is a Primitive.div rather than a DialogPrimitive.Description
// find out why later; misses p and some a11y features
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

export const DialogAction = DialogPrimitive.CloseButton;
