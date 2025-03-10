import { Dialog as DialogPrimitive, useDialogContext } from "@seed-design/react-dialog";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { bottomSheet, type BottomSheetVariantProps } from "@seed-design/css/recipes/bottom-sheet";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import { withStyleProps, type StyleProps } from "../../utils/styled";

const { withRootProvider, withContext } = createSlotRecipeContext(bottomSheet);
const withStateProps = createWithStateProps([useDialogContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetRootProps extends BottomSheetVariantProps, DialogPrimitive.RootProps {}

export const BottomSheetRoot = withRootProvider<BottomSheetRootProps>(DialogPrimitive.Root, {
  defaultProps: {
    lazyMount: true,
    unmountOnExit: true,
  },
});

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetTriggerProps extends DialogPrimitive.TriggerProps {}

export const BottomSheetTrigger = DialogPrimitive.Trigger;

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetPositionerProps extends DialogPrimitive.PositionerProps {}

export const BottomSheetPositioner = withContext<HTMLDivElement, BottomSheetPositionerProps>(
  DialogPrimitive.Positioner,
  "positioner",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetBackdropProps extends DialogPrimitive.BackdropProps {}

export const BottomSheetBackdrop = withContext<HTMLDivElement, BottomSheetBackdropProps>(
  DialogPrimitive.Backdrop,
  "backdrop",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetContentProps extends DialogPrimitive.ContentProps {}

export const BottomSheetContent = withContext<HTMLDivElement, BottomSheetContentProps>(
  DialogPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetHeader = withContext<HTMLDivElement, BottomSheetHeaderProps>(
  withStateProps(Primitive.div),
  "header",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetTitleProps extends DialogPrimitive.TitleProps {}

export const BottomSheetTitle = withContext<HTMLHeadingElement, BottomSheetTitleProps>(
  withStateProps(Primitive.h2),
  "title",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetDescriptionProps extends DialogPrimitive.DescriptionProps {}

export const BottomSheetDescription = withContext<
  HTMLParagraphElement,
  BottomSheetDescriptionProps
>(withStateProps(Primitive.p), "description");

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetBodyProps
  extends PrimitiveProps,
    Pick<
      StyleProps,
      "paddingX" | "height" | "maxHeight" | "minHeight" | "justifyContent" | "alignItems"
    >,
    React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetBody = withContext<HTMLDivElement, BottomSheetBodyProps>(
  withStyleProps(withStateProps(Primitive.div)),
  "body",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetFooter = withContext<HTMLDivElement, BottomSheetFooterProps>(
  withStateProps(Primitive.div),
  "footer",
);

////////////////////////////////////////////////////////////////////////////////////

export interface BottomSheetCloseButtonProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const BottomSheetCloseButton = withContext<HTMLButtonElement, BottomSheetCloseButtonProps>(
  DialogPrimitive.CloseButton,
  "closeButton",
);
