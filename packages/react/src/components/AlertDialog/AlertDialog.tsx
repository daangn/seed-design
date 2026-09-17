import { Dialog as DialogPrimitive } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { alertDialog, type AlertDialogVariantProps } from "@seed-design/css/recipes/alert-dialog";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withRootProvider, withContext } = createSlotRecipeContext(alertDialog);

////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogRootProps extends AlertDialogVariantProps, DialogPrimitive.RootProps {
  /**
   * @default "alertdialog"
   */
  role?: DialogPrimitive.RootProps["role"];
  /**
   * @default false
   */
  closeOnInteractOutside?: DialogPrimitive.RootProps["closeOnInteractOutside"];
  /**
   * @default true
   */
  lazyMount?: DialogPrimitive.RootProps["lazyMount"];
  /**
   * @default true
   */
  unmountOnExit?: DialogPrimitive.RootProps["unmountOnExit"];
}

export const AlertDialogRoot = withRootProvider<AlertDialogRootProps>(DialogPrimitive.Root, {
  defaultProps: {
    role: "alertdialog",
    closeOnInteractOutside: false,
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogTriggerProps extends DialogPrimitive.TriggerProps {}

export const AlertDialogTrigger = DialogPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogPositionerProps extends DialogPrimitive.PositionerProps {}

export const AlertDialogPositioner = withContext<HTMLDivElement, AlertDialogPositionerProps>(
  DialogPrimitive.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogBackdropProps extends DialogPrimitive.BackdropProps {}

export const AlertDialogBackdrop = withContext<HTMLDivElement, AlertDialogBackdropProps>(
  DialogPrimitive.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogContentProps extends DialogPrimitive.ContentProps {}

export const AlertDialogContent = withContext<HTMLDivElement, AlertDialogContentProps>(
  DialogPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AlertDialogHeader = withContext<HTMLDivElement, AlertDialogHeaderProps>(
  Primitive.div,
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogTitleProps extends DialogPrimitive.TitleProps {}

export const AlertDialogTitle = withContext<HTMLHeadingElement, AlertDialogTitleProps>(
  DialogPrimitive.Title,
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogDescriptionProps extends DialogPrimitive.DescriptionProps {}

export const AlertDialogDescription = withContext<
  HTMLParagraphElement,
  AlertDialogDescriptionProps
>(DialogPrimitive.Description, "description");

////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const AlertDialogFooter = withContext<HTMLDivElement, AlertDialogFooterProps>(
  Primitive.div,
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AlertDialogActionProps extends DialogPrimitive.CloseButtonProps {}

export const AlertDialogAction = DialogPrimitive.CloseButton;
